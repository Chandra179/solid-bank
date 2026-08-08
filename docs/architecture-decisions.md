# Architecture Decisions

Summary of the decisions made while designing this project, for future-you
(or anyone else) to see the reasoning, not just the result.

## Regulatory approach
Real OJK digital bank licensing requires ~IDR 10 trillion minimum paid-up
capital and a multi-person board that passes fit-and-proper testing — not
achievable solo. This project integrates with a licensed BaaS partner
(Brankas/Ayoconnect) instead of pursuing its own license.

## Monorepo, modular monolith (not microservices)
One person building both frontend and backend benefits from shared context
and one CI pipeline; microservices solve organizational/team-scaling
problems this project doesn't have. Module boundaries under
`apps/api/internal/*` are kept clean specifically so a module *could* be
split into its own service later if that ever becomes necessary.

## Go stack: gin, sqlx, zap, goose, gin-swagger
sqlx over a full ORM so SQL touching money is explicit and reviewable, not
generated. goose for migrations — never edit a migration that has already
run anywhere, always write a new one. zap for structured logs with a
request ID on every line. gin-swagger keeps the OpenAPI spec close to the
handlers, which feeds the mobile app's generated TypeScript types.

## Auth: OIDC relying party, Auth0 now / Keycloak optional later
This service never issues tokens or stores passwords — it validates JWTs
from an external IdP. Auth0's free tier (25k MAU) is fine for prototyping,
but MFA and other security features that a banking-style app needs sit
behind a paid tier — budget for that before real users/money are involved.
Self-hosted Keycloak is a valid free alternative once the ops overhead of
running it is worth it, which likely isn't yet for a solo dev.

## Reverse proxy: Traefik (also loosely "gateway")
Traefik handles TLS termination and routing today. It's called a "gateway"
loosely — with a single backend service there's no real multi-service
routing/policy problem yet. Traefik earns the fuller gateway role only if
modules are ever split into separate services.

## Observability: OpenTelemetry instrumented, Sentry as current sink
Instrument with OTel from day one since that's the hard part to retrofit.
Point it at Sentry now; migrate the sink to a self-hosted Grafana LGTM
stack later without touching instrumentation code. Uptime monitoring
(UptimeRobot/Better Stack free tier) is kept even though everything else is
minimal — Sentry only reports errors inside a running process, not "the
process/proxy/DNS is down," which is a distinct and cheap-to-cover failure
mode for something as availability-sensitive as a banking app.

## Money integrity: shadow ledger + append-only audit log + reconciliation
The BaaS partner's ledger is the source of truth. This project keeps a
local double-entry `ledger_entries` table for fast reads and as something
to reconcile against, never as the authoritative balance. `audit_log` is
insert-only, enforced at the DB grant level (not just app code) — see
`apps/api/migrations/0001_init.sql`. `reconciliation_exceptions` records
mismatches for human review; nothing here auto-corrects a discrepancy.

## Explicitly deferred (revisit only when a real need forces it)
- **TigerBeetle** — built for extreme write-heavy OLTP (millions of tx/sec);
  Postgres handles a shadow ledger fine at any scale this project will see
  for a long time.
- **Card issuance / fulfillment service** — only relevant if/once a card
  product is on the roadmap; check whether the BaaS partner even offers it
  before building anything here.
- **Dedicated API gateway product** (Kong etc.) — no multi-service traffic
  to manage yet.
- **Kubernetes** — Fly.io/Railway/Render cover a solo deploy without this
  overhead.
- **pnpm workspace / Turborepo** — only one JS package (`apps/mobile`)
  exists; add workspace tooling when a second one does (e.g. a shared
  types package used by more than one app, or a web dashboard).
