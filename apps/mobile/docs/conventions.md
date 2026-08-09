# App conventions

Working notes on the patterns this codebase has settled on, written down so
the next screen someone adds follows the same shape instead of quietly
diverging. Update this file when a pattern here actually changes — a stale
convention doc is worse than none.

## Data fetching: React Query, not ad hoc refresh

Every screen that reads from the mock data layer (`src/data/*.ts`) goes
through a hook in `src/data/queries.ts` (`usePockets()`, `useAccountSummary()`,
etc.), never a direct `listPockets()`/`getAccountSummary()` call inside a
component body. The one exception is a screen reading a single record it
already has an id for outside of render (e.g. a route param lookup that
doesn't need to be reactive) — even then, prefer the query hook if one
exists.

Every screen that **writes** — creates, updates, deletes, or otherwise
mutates the mock data — calls `useInvalidateData()` from
`src/data/queries.ts` right after the write. This busts every cached
`"data"`-prefixed query, so any other screen holding stale data refetches
the next time it's read. This is deliberately coarse (see the comment above
`useInvalidateData` in `queries.ts` for the reasoning) rather than a
per-mutation invalidation map — don't add narrower invalidation without a
measured reason to.

The old pattern this replaced — `useFocusEffect` bumping a local counter via
`src/hooks/useRefreshOnFocus.ts` — is retired. The hook file is kept for
reference but no screen should import it anymore. If you find one that
still does, that's a bug, not an example to copy.

## Loading states

Every query-backed screen guards its first render with the shared
`LoadingState` component (`src/components/LoadingState.tsx`) rather than
rendering with `undefined`/empty data and hoping the UI degrades gracefully:

```tsx
const { data: pockets, isLoading } = usePockets();
if (isLoading || !pockets) return <LoadingState />;
```

Use the bare (non-`inline`) form when the query result is the screen's only
content — it renders its own `SafeAreaView` so the early return doesn't need
to duplicate a screen's edges/background boilerplate. Use `inline` when a
screen already has a header or other static chrome and only a section below
it is still loading.

This mock layer's reads are all synchronous under the hood, so in practice
this spinner is on screen for a fraction of a frame — it exists so the
pattern is already in place and reads as intentional once a real API
introduces actual latency here, not so it gets a lot of visible use today.

## Information architecture: Home's primary action row

Home's quick-action row is a fixed-width (`25%`), wrapping grid
(`flex-row flex-wrap`), not a `flex-row justify-between` row. The next
primary money-move action added to Home should get its own `<View
style={{ width: "25%" }}>` slot and let the grid wrap it into a new row,
rather than adding a 5th/6th item to `justify-between` — that silently
re-squeezes every existing icon's spacing each time one is added, which is
what happened when Bills went in as a 5th icon under the old layout.

If a feature is already reachable from `BottomNav` (like Pockets, via its
own tab), it's a reasonable candidate to relocate to a second row before
reaching for a "More" overflow menu — see the comment in `HomeScreen.tsx`
next to the Pockets slot for the specific reasoning that was applied there.

## PIN handling

`store/session.ts` never holds a raw PIN — it stores `hashPin(pin)` (see
`src/utils/pinHash.ts`) and exposes `setPin(rawPin)` / `verifyPin(rawPin)`
so no component compares against a plaintext value directly. This is still
a demo simplification, not real security — see the comments in both files
for exactly what it does and doesn't protect against, and what a real
implementation would do instead (server-side verification or a secure
enclave, never a client-side hash compare).
