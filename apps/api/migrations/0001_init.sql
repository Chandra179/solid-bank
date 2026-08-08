-- +goose Up
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id   UUID NOT NULL,
    baas_account_id TEXT NOT NULL UNIQUE, -- the account ID as known by the BaaS provider
    currency        TEXT NOT NULL DEFAULT 'IDR',
    status          TEXT NOT NULL DEFAULT 'pending_kyc',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shadow double-entry ledger. Source of truth is the BaaS provider; this
-- mirrors it for fast reads and gives reconciliation something to diff
-- against. transaction_ref + type is unique so retried webhooks can't
-- double-post (see internal/ledger).
CREATE TABLE ledger_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    transaction_ref TEXT NOT NULL,
    type            TEXT NOT NULL CHECK (type IN ('debit', 'credit')),
    amount_minor    BIGINT NOT NULL CHECK (amount_minor >= 0), -- integer minor units only, never float
    currency        TEXT NOT NULL,
    source          TEXT NOT NULL, -- 'baas_webhook' | 'baas_api_sync' | 'internal_adjustment'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (transaction_ref, type)
);

CREATE INDEX idx_ledger_entries_account_id ON ledger_entries(account_id);

-- Reconciliation exceptions: anything that didn't match between our shadow
-- ledger and the BaaS provider's statement. Never auto-resolved by code —
-- resolved_at is only ever set by a human reviewing it.
CREATE TABLE reconciliation_exceptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id          UUID NOT NULL REFERENCES accounts(id),
    transaction_ref     TEXT,
    kind                TEXT NOT NULL, -- 'missing_local' | 'missing_remote' | 'amount_mismatch' | 'duplicate'
    local_amount_minor  BIGINT,
    remote_amount_minor BIGINT,
    detected_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at         TIMESTAMPTZ,
    resolved_by         UUID,
    notes               TEXT
);

-- Append-only audit trail. Application role privileges are locked down
-- below so even a bug can't UPDATE or DELETE a row here — only INSERT.
CREATE TABLE audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type  TEXT NOT NULL, -- 'user' | 'system' | 'baas_webhook'
    actor_id    TEXT,
    action      TEXT NOT NULL, -- e.g. 'account.balance_changed', 'kyc.status_changed'
    entity_type TEXT NOT NULL,
    entity_id   TEXT NOT NULL,
    metadata    JSONB,
    request_id  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- Lock the audit trail down at the DB level, not just in application code.
-- Replace `app_user` with your actual application DB role.
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
        REVOKE UPDATE, DELETE ON audit_log FROM app_user;
    END IF;
END
$$;

-- +goose Down
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS reconciliation_exceptions;
DROP TABLE IF EXISTS ledger_entries;
DROP TABLE IF EXISTS accounts;
