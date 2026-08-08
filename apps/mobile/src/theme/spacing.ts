// Central spacing scale for the inline `style={{ gap }}` values used
// throughout the app. React Native's `gap` isn't reachable via a Tailwind
// className the way padding/margin are, so — like colors.ts for inline
// `style={{ color }}` values — this is the one place the scale lives
// instead of each screen picking its own gap number. Values mirror what
// was already in consistent use (4/8/12/16/20); odd one-off values (2, 6,
// 10) found in a couple of screens are fine to keep as literals for local
// alignment tweaks rather than forcing them into this scale.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;
