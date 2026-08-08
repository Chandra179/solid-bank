// Package ledger is the shadow, double-entry ledger that mirrors the
// authoritative ledger held by the BaaS/sponsor bank. It exists so the app
// can read balances/history fast without round-tripping to the BaaS API on
// every screen, and so the reconciliation service has something local to
// compare against the bank's records.
//
// It is NOT the source of truth for real money — the BaaS partner's ledger
// is. Every write here should be traceable back to either a BaaS webhook
// event or a BaaS API response, never invented locally.
package ledger

import (
	"context"

	"github.com/jmoiron/sqlx"
)

// EntryType follows standard double-entry convention: every transaction
// produces at least one debit and one credit entry that must sum to zero
// for a given transaction_ref.
type EntryType string

const (
	Debit  EntryType = "debit"
	Credit EntryType = "credit"
)

type Entry struct {
	ID             string    `db:"id"`
	AccountID      string    `db:"account_id"`
	TransactionRef string    `db:"transaction_ref"` // idempotency key, usually the BaaS transaction ID
	Type           EntryType `db:"type"`
	AmountMinor    int64     `db:"amount_minor"` // always store money as integer minor units (sen), never float
	Currency       string    `db:"currency"`
	Source         string    `db:"source"` // "baas_webhook" | "baas_api_sync" | "internal_adjustment"
}

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

// RecordEntry inserts a ledger entry idempotently on transaction_ref — a
// retried webhook must never double-post. See migrations/0001_init.sql for
// the unique constraint that backs this.
func (r *Repository) RecordEntry(ctx context.Context, tx *sqlx.Tx, e Entry) error {
	const q = `
		INSERT INTO ledger_entries (account_id, transaction_ref, type, amount_minor, currency, source)
		VALUES (:account_id, :transaction_ref, :type, :amount_minor, :currency, :source)
		ON CONFLICT (transaction_ref, type) DO NOTHING
	`
	_, err := tx.NamedExecContext(ctx, q, e)
	return err
}

// BalanceMinor computes the current balance for an account from its ledger
// entries. This should always match what the BaaS partner reports for the
// same account — the reconciliation service's whole job is verifying that.
func (r *Repository) BalanceMinor(ctx context.Context, accountID string) (int64, error) {
	const q = `
		SELECT COALESCE(SUM(CASE WHEN type = 'credit' THEN amount_minor ELSE -amount_minor END), 0)
		FROM ledger_entries
		WHERE account_id = $1
	`
	var balance int64
	err := r.db.GetContext(ctx, &balance, q, accountID)
	return balance, err
}
