// Central type scale, mirroring this directory's colors.ts. The app's
// screens already converged on a real 3-size scale (11/13/15px, on top of
// Tailwind's default heading sizes like text-xl/2xl/4xl) — it just had no
// name behind it, so every `text-[13px]` read as an arbitrary one-off
// instead of "this is the body size, on purpose." The matching Tailwind
// classes (`text-caption` / `text-body` / `text-label`) are registered in
// tailwind.config.js's theme.extend.fontSize; use those in className
// rather than the raw px values going forward.
//
// This is applied to the shared component layer (Button, TransactionRow,
// SelectRow, EmptyState, QuickAction, BottomNav, PocketCard) and to
// screens touched alongside this change. Not yet swept across every
// screen — see TODO.md.
export const typography = {
  caption: { px: 11, className: "text-caption" }, // timestamps, sub-labels
  body: { px: 13, className: "text-body" }, // default row/paragraph text
  label: { px: 15, className: "text-label" }, // button labels, list titles
} as const;
