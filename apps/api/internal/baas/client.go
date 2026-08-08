// Package baas wraps the BaaS provider's API (Brankas/Ayoconnect) behind a
// small interface so the rest of the codebase never imports a provider SDK
// directly. Swapping providers later — or plugging in a local mock server
// for development before a contract is signed — should mean writing one new
// file here, not touching every module that moves money.
package baas

import "context"

type Account struct {
	ID           string
	OwnerUserID  string
	BalanceMinor int64
	Currency     string
	Status       string // "active" | "pending_kyc" | "frozen"
}

type TransferRequest struct {
	FromAccountID  string
	ToAccountID    string
	AmountMinor    int64
	Currency       string
	IdempotencyKey string
}

type Client interface {
	GetAccount(ctx context.Context, accountID string) (Account, error)
	CreateTransfer(ctx context.Context, req TransferRequest) (transactionRef string, err error)
	// FetchStatement returns transactions for reconciliation.Run to compare
	// against the local ledger. Shape is intentionally provider-agnostic.
	FetchStatement(ctx context.Context, accountID string) ([]StatementLine, error)
}

type StatementLine struct {
	TransactionRef string
	AmountMinor    int64
	Currency       string
}

// MockClient is an in-memory stand-in so the app and its tests can run
// before a real BaaS contract/integration exists. Swap for a real client
// (e.g. brankas.Client) behind the same interface once you're integrating.
type MockClient struct{}

func NewMockClient() *MockClient { return &MockClient{} }

func (m *MockClient) GetAccount(ctx context.Context, accountID string) (Account, error) {
	return Account{ID: accountID, BalanceMinor: 0, Currency: "IDR", Status: "active"}, nil
}

func (m *MockClient) CreateTransfer(ctx context.Context, req TransferRequest) (string, error) {
	return "mock-" + req.IdempotencyKey, nil
}

func (m *MockClient) FetchStatement(ctx context.Context, accountID string) ([]StatementLine, error) {
	return nil, nil
}
