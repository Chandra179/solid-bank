package platform

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// NewDB opens a connection pool. sqlx (not a full ORM) is intentional here —
// financial code should read the SQL it runs, not have it generated for it.
func NewDB(databaseURL string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", databaseURL)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(5)
	return db, nil
}
