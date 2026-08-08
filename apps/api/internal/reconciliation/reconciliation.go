// Package reconciliation compares the local shadow ledger against the
// BaaS partner's authoritative records and surfaces mismatches for review.
//
// Deliberately, this package never auto-corrects a discrepancy — a mismatch
// almost always means either a bug or a real financial problem, and both
// deserve a human look rather than a silent fix.
package reconciliation

import (
	"context"
	"time"

	"github.com/jmoiron/sqlx"
)

type Exception struct {
	ID             string     `db:"id"`
	AccountID      string     `db:"account_id"`
	TransactionRef string     `db:"transaction_ref"`
	Kind           string     `db:"kind"` // "missing_local" | "missing_remote" | "amount_mismatch" | "duplicate"
	LocalAmount    *int64     `db:"local_amount_minor"`
	RemoteAmount   *int64     `db:"remote_amount_minor"`
	DetectedAt     time.Time  `db:"detected_at"`
	ResolvedAt     *time.Time `db:"resolved_at"`
}

// BaaSStatementLine is the normalized shape we expect after mapping a
// BaaS provider's (Brankas/Ayoconnect) statement/transaction export into a
// common format, so the comparison logic doesn't care which provider it is.
type BaaSStatementLine struct {
	TransactionRef string
	AmountMinor    int64
	Currency       string
}

type Service struct {
	db *sqlx.DB
}

func NewService(db *sqlx.DB) *Service {
	return &Service{db: db}
}

// Run compares one account's local ledger entries against a fetched BaaS
// statement and records any mismatches as exceptions. Intended to be called
// from a scheduled job (cron / pg_cron), not from request handlers.
func (s *Service) Run(ctx context.Context, accountID string, remoteLines []BaaSStatementLine) ([]Exception, error) {
	// Scaffold only — real implementation:
	//   1. load local ledger_entries for accountID grouped by transaction_ref
	//   2. diff against remoteLines by transaction_ref
	//   3. for each mismatch, INSERT INTO reconciliation_exceptions (never UPDATE existing ledger rows)
	//   4. alert (log/Sentry) if any exception was found
	return nil, nil
}
