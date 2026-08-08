// Package audit provides an append-only trail of everything that happens to
// a financially meaningful record (account, transaction, KYC status, etc).
//
// Rules for this package, deliberately strict:
//  1. Only Record() ever writes here. There is no Update or Delete function
//     on purpose — don't add one.
//  2. The underlying table's DB grants should also revoke UPDATE/DELETE for
//     the application role (see migrations/0001_init.sql). Application-level
//     discipline alone is not enough for an audit trail.
//  3. Call Record() in the same DB transaction as the change it's describing,
//     so an audit entry can never be missing for a change that committed.
package audit

import (
	"context"
	"encoding/json"

	"github.com/jmoiron/sqlx"
)

type Entry struct {
	ID         string          `db:"id"`
	ActorType  string          `db:"actor_type"` // "user" | "system" | "baas_webhook"
	ActorID    string          `db:"actor_id"`
	Action     string          `db:"action"`      // e.g. "account.balance_changed"
	EntityType string          `db:"entity_type"` // e.g. "account"
	EntityID   string          `db:"entity_id"`
	Metadata   json.RawMessage `db:"metadata"`
	RequestID  string          `db:"request_id"`
}

type Recorder struct {
	db *sqlx.DB
}

func NewRecorder(db *sqlx.DB) *Recorder {
	return &Recorder{db: db}
}

// Record inserts one immutable audit entry. Pass tx (not r.db) when this is
// part of a larger transaction — see the package doc comment.
func (r *Recorder) Record(ctx context.Context, tx *sqlx.Tx, e Entry) error {
	const q = `
		INSERT INTO audit_log (actor_type, actor_id, action, entity_type, entity_id, metadata, request_id)
		VALUES (:actor_type, :actor_id, :action, :entity_type, :entity_id, :metadata, :request_id)
	`
	if tx != nil {
		_, err := tx.NamedExecContext(ctx, q, e)
		return err
	}
	_, err := r.db.NamedExecContext(ctx, q, e)
	return err
}
