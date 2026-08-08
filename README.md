# Digital Bank (side project)

A React Native app backed by a Go modular monolith, integrating with a
licensed BaaS partner (Brankas/Ayoconnect) rather than holding its own
banking license. See `docs/` for the architecture decisions behind this
setup.

## Stack

- **Backend**: Go (gin, sqlx, zap, goose migrations), modular monolith under `apps/api/internal/*`
- **Frontend**: React Native + TypeScript + NativeWind (Tailwind)
- **DB**: Postgres
- **Reverse proxy**: Traefik
- **Auth**: OAuth2 + OIDC — this service is a relying party only (Auth0 today, Keycloak optionally later)
- **Observability**: OpenTelemetry-instrumented, Sentry as the current sink
- **Money integrity**: append-only `audit_log` table + a separate reconciliation service comparing the shadow ledger against the BaaS partner's records

## Repo layout

```
apps/
  api/       Go modular monolith (cmd/server, internal/<module>)
  mobile/    React Native + TypeScript + NativeWind app
infra/       docker-compose (Postgres + Traefik + api), deployment configs
docs/        architecture notes
```

## Local development

Prerequisites: Docker, Go 1.22+, Node 18+, `goose` CLI (`go install github.com/pressly/goose/v3/cmd/goose@latest`).

```bash
# 1. Start Postgres + Traefik + the API
make dev

# 2. In another terminal, run migrations
make migrate-up

# 3. Confirm the API is up
curl http://localhost/health

# 4. Install and run the mobile app
make mobile-install
cd apps/mobile && npm run ios   # or npm run android
```

The API runs without auth-protected routes until `OIDC_ISSUER_URL` and
`OIDC_CLIENT_ID` are set (see `infra/docker-compose.yml`) — wire these up
once you have an Auth0 application (or self-hosted Keycloak) configured.

The `internal/baas` package currently uses `MockClient`, an in-memory stand-in
for the real BaaS provider. Swap it for a real client behind the same
`baas.Client` interface once a BaaS contract/integration is in place — no
other package should need to change.

## What's intentionally NOT here yet

Per the architecture decisions in `docs/`: no microservices, no TigerBeetle,
no card-issuing/fulfillment service, no dedicated API gateway product, no
Kubernetes, no pnpm workspace/Turborepo (single JS package doesn't need it
yet). Add these only when a real scale/feature need forces the question —
see `docs/architecture-decisions.md`.
