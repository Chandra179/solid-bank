package platform

import "os"

// Config holds all environment-driven configuration for the service.
// Keep this the single place that reads os.Getenv — nothing else in the
// codebase should call os.Getenv directly, so config stays testable and
// discoverable.
type Config struct {
	Env         string // "local" | "staging" | "production"
	HTTPPort    string
	DatabaseURL string

	OIDCIssuerURL string
	OIDCClientID  string

	SentryDSN string
}

func LoadConfig() Config {
	return Config{
		Env:           getEnv("APP_ENV", "local"),
		HTTPPort:      getEnv("HTTP_PORT", "8080"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/digital_bank?sslmode=disable"),
		OIDCIssuerURL: getEnv("OIDC_ISSUER_URL", ""),
		OIDCClientID:  getEnv("OIDC_CLIENT_ID", ""),
		SentryDSN:     getEnv("SENTRY_DSN", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
