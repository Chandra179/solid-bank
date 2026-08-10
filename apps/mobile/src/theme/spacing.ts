// Central spacing scale for the inline `style={{ gap }}` values used
// throughout the app. React Native's `gap` isn't reachable via a Tailwind
// className the way padding/margin are, so — like colors.ts for inline
// `style={{ color }}` values — this is the one place the scale lives
// instead of each screen picking its own gap number.
//
// A design-system audit found `gap: 6` and `gap: 10` were never actually
// one-off exceptions — they're the real label→input spacing (6, used in
// every form screen: CreatePocket/EditPocket/AddRecipient/BillInput/
// SpendingInsights) and row-icon-to-text spacing (10, used in Home/
// PocketDetail/Cards/DigitEntry) across a dozen+ screens each, which makes
// them load-bearing scale steps this file was previously silent about
// rather than genuine local exceptions. Named `xxs`/`sm2` (not `sm`/`md`,
// which are already taken) so they read as "between the neighboring steps"
// rather than implying a full renumbering of the existing scale.
export const spacing = {
  xxs: 6,
  xs: 4,
  sm: 8,
  sm2: 10,
  md: 12,
  lg: 16,
  xl: 20,
} as const;
