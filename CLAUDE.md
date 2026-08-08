# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A digital bank side project (solo dev): React Native mobile app backed by a Go
modular monolith, integrating with a licensed BaaS partner (Brankas/Ayoconnect)
rather than holding its own banking license. See `docs/architecture-decisions.md`
for the reasoning behind most non-obvious choices below — check it before
proposing a different stack/pattern (e.g. splitting into microservices,
introducing Kubernetes, or a pnpm workspace) since those are deliberately
deferred, not overlooked.

## Repo layout

```
apps/
  api/       Go modular monolith (cmd/server, internal/<module>)
  mobile/    React Native + TypeScript + NativeWind app
infra/       docker-compose (Postgres + Traefik + api), deployment configs
docs/        architecture notes
```

## Commands

```bash
# Backend: start Postgres + Traefik + the API (Docker)
make dev

# Run migrations (requires: go install github.com/pressly/goose/v3/cmd/goose@latest)
make migrate-up
make migrate-down

# Run the API directly on host against dockerized Postgres
make api-run
make api-build

# Mobile
make mobile-install
cd apps/mobile && npm run ios       # or npm run android
make mobile-web                     # web build via Vite, no native toolchain needed
cd apps/mobile && npm run lint
cd apps/mobile && npm run typecheck
cd apps/mobile && npm run gen:types # regenerate src/api/types.gen.ts from apps/api/docs/openapi.json

# Run API + mobile web together
make run
```

No Go test files exist yet (`apps/api/internal/**/*_test.go` — none present),
and the mobile app has no test runner configured despite `@types/jest` being
listed. Don't assume `go test ./...` or a JS test command will find anything
until tests are actually added.

The API has no auth-protected routes until `OIDC_ISSUER_URL` and
`OIDC_CLIENT_ID` are set (see `infra/docker-compose.yml`).

## Backend architecture (`apps/api`)

Modular monolith, not microservices — one Go module, packages under
`internal/<module>`: `accounts`, `audit`, `auth`, `baas`, `kyc`, `ledger`,
`notifications`, `payments`, `platform`, `pockets`, `reconciliation`. Module
boundaries are kept clean specifically so a module *could* become its own
service later, but most modules are currently stubs (a handful of lines) —
`cmd/server/main.go` only wires up `/health` and an OIDC-gated `/api/v1/me`
so far. Don't be surprised by how little is implemented; check module file
sizes before assuming functionality exists.

Stack: gin (HTTP), sqlx (no ORM — SQL touching money is explicit and
reviewable), zap (structured logs, request ID on every line via
`platform.RequestID()`/`platform.RequestLogger()`), goose (migrations under
`apps/api/migrations/`, currently just `0001_init.sql`). **Never edit a
migration that has already run anywhere — always write a new one.**

**BaaS integration**: `internal/baas.Client` is an interface; the only
implementation right now is `MockClient` (in-memory, no real provider calls).
Swap in a real client (e.g. `brankas.Client`) behind the same interface once
a BaaS contract exists — no other package should need to change. Don't
implement provider-specific logic outside `internal/baas`.

**Auth**: `internal/auth` is an OIDC relying party only — this service never
issues tokens or stores passwords, it validates JWTs from an external IdP
(Auth0 today, Keycloak optionally later).

**Money integrity model**: the BaaS partner's ledger is the source of truth.
`internal/ledger` keeps a local double-entry `ledger_entries` table for fast
reads and reconciliation — never treat it as authoritative. `audit_log` is
insert-only, enforced at the DB grant level (see `0001_init.sql`), not just
in application code. `internal/reconciliation` records mismatches in
`reconciliation_exceptions` for human review — nothing auto-corrects a
discrepancy; don't add auto-correction logic here.

`apps/api/vendor/` is committed (Go vendoring) — expect it in diffs/greps and
exclude it when searching for actual application code.

## Mobile architecture (`apps/mobile`)

Bare React Native CLI project (not Expo — no `expo` package/config, has full
`android/`/`ios/` native folders). React Navigation (`native-stack`) for
screen routing, Zustand for session state (`src/store/session.ts` — session
only; server data is meant to go through a query library once one is added,
not through Zustand), NativeWind/Tailwind for styling.

**Dual build target**: the same `App.tsx`/component tree also builds for web
via Vite + `react-native-web` (`npm run web`, `vite.config.ts`). This is
deliberate but requires shims: `src/native-stubs/` replaces RN internals
(`codegenNativeComponent`, `TurboModuleRegistry`) for the web build, and
`src/env.web.ts` mirrors `src/env.d.ts`/`@env` (which is populated via
`react-native-dotenv` on the Metro/native side) using `import.meta.env` for
Vite. If you change how env vars are loaded or add a native-only API, update
both sides or the web build breaks.

**Everything is currently mock data**, but not ad hoc — `src/data/` is a
synchronous mock-repository layer (`mockAccount.ts`, `mockPockets.ts`,
`mockTransactions.ts`, `mockBeneficiaries.ts`, `mockFundingSources.ts`,
`mockUser.ts`, `types.ts`), barrel-exported via `src/data/index.ts`.
**Screens must import from `@/data`, never reach into an individual
`mockX.ts` file** — that's what makes swapping any one of these for a real
API call later an internal change to `src/data/` instead of a call-site hunt
across every screen. `src/api/client.ts` (thin fetch wrapper around
`/health`, `/api/v1/me`) exists but nothing calls it yet. Screens don't
refresh on their own when mock data changes elsewhere — the fix in use is
`useFocusEffect` + a dummy re-render counter (see `HomeScreen.tsx`), applied
screen-by-screen as staleness is noticed, not everywhere yet.

Shared formatting helpers belong in `src/utils/` (`currency.ts`'s
`formatIDR`/`formatSignedIDR`, `greeting.ts`'s `getGreeting`,
`relativeDate.ts`'s `formatRelativeDate`) — these were previously
copy-pasted per-screen with drift between copies; don't reintroduce a local
copy in a new screen, import from here instead.

**NativeWind + `Animated` gotcha, already regressed once**: NativeWind's
babel/vite transform only auto-styles JSX elements using the exact tag names
it recognizes as core RN primitives (`View`, `Text`, `Pressable`, ...).
Wrapping one in `Animated.createAnimatedComponent(...)` produces a new
component it doesn't recognize, so `className` on that wrapped component is
silently inert on native (no background/rounding/centering — just bare
text) even though it can appear to work on the web build. `Button.tsx`
hit this, got fixed by animating a plain `Animated.View` wrapper around an
un-wrapped `Pressable` (so `className` only ever lands on a real, recognized
primitive), and a later refactor reverted straight back to the broken
`AnimatedPressable` + `className` pattern while leaving the old comment in
place claiming the fix was still there. Check `git log -p` on a component
before trusting an in-file comment about *why* something is structured a
certain way — the code and the comment had drifted apart. If you need to
animate a `Pressable`/`View`/etc., animate a plain wrapper around it; don't
`className` an `Animated.createAnimatedComponent(...)` result directly (and
if you must, register it with `nativewind`'s `cssInterop()` — but note that
`import { cssInterop } from "nativewind"` breaks the Vite web build, since
it pulls in a `.js` file with real JSX not covered by Vite's default JSX
parsing).

**Deliberately custom, not oversights** (don't "fix" these without checking
with the user first):
- `src/components/BottomNav.tsx` — presentational-only tab bar, not wired to
  `@react-navigation/bottom-tabs` (not installed). Comment in the file says
  to swap it in once there's more than one tab-level screen worth switching
  between.
- `src/components/icons/index.tsx` — hand-built SVG icon set on
  `react-native-svg` primitives instead of an icon library, by choice.

No CI/CD is configured for mobile (no GitHub Actions, no Fastlane, no EAS).

`apps/mobile/TODO.md` is a living backlog of known UX/tech-debt/accessibility
gaps, kept up to date in commits (checked-off items list what was actually
changed and where) — check it before assuming a gap you noticed is unknown,
and check items off there rather than re-discovering them from scratch.
