.PHONY: dev migrate-up migrate-down api-run api-build mobile-install

# Bring up Postgres + Traefik + the Go API for local development.
dev:
	docker compose -f infra/docker-compose.yml up --build

# Run DB migrations with goose. Requires: go install github.com/pressly/goose/v3/cmd/goose@latest
migrate-up:
	cd apps/api && goose -dir migrations postgres "postgres://postgres:postgres@localhost:5432/digital_bank?sslmode=disable" up

migrate-down:
	cd apps/api && goose -dir migrations postgres "postgres://postgres:postgres@localhost:5432/digital_bank?sslmode=disable" down

# Run the Go API directly on the host (against dockerized Postgres).
api-run:
	cd apps/api && DATABASE_URL="postgres://postgres:postgres@localhost:5432/digital_bank?sslmode=disable" go run ./cmd/server

api-build:
	cd apps/api && go build -o bin/server ./cmd/server

mobile-install:
	cd apps/mobile && npm install
