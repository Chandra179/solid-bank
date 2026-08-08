# TODO

A living backlog of known gaps, reconstructed from ongoing UI/UX + code
audits. Check items off in commits as they're closed; add new ones as
they're found rather than re-discovering them from scratch next session.

## UX / product gaps

- [x] Home's greeting is now time-of-day aware (`getGreeting()` in
      `src/utils/greeting.ts`) and uses the real user name instead of a
      hardcoded "Jack".
- [x] Home's "Recent Transactions → See all" now opens a real
      `TransactionsScreen` (`src/screens/TransactionsScreen.tsx`) instead
      of doing nothing.
- [x] Home, Pockets, and PocketDetail now refresh their mock-data reads on
      focus (`useFocusEffect` + a re-render counter), so e.g. a pocket
      created via CreatePocketScreen shows up immediately on goBack instead
      of needing a full remount. Not yet applied to every screen that reads
      mock data (e.g. TransferScreen's pocket row, Confirm) — extend the
      same pattern there if staleness shows up.
- [x] Profile now has real Security / Notifications / Help rows, each
      routed to the same ComingSoon placeholder every other not-built-yet
      destination uses. `src/screens/ProfileScreen.tsx`

## Code quality / tech debt

- [x] `formatIDR`/`formatSignedIDR` centralized in `src/utils/currency.ts`;
      the 6 duplicated copies (PocketCard, HomeScreen, SuccessScreen,
      ConfirmScreen, PocketDetailScreen, ReceiptScreen) plus
      TransactionRow's own copy now all import from there.
- [x] Typography tokens added: `text-caption`/`text-body`/`text-label`
      registered in `tailwind.config.js` (fontSize), documented in
      `src/theme/typography.ts`. Applied to the shared component layer
      (Button, TransactionRow, SelectRow, EmptyState, QuickAction,
      BottomNav, PocketCard) and to the screens touched alongside the
      other fixes in this pass (Home, Confirm, PocketDetail, Success,
      Receipt). Spacing tokens live in `src/theme/spacing.ts` for the
      inline `style={{ gap }}` values, same treatment.
      **Not yet swept app-wide** — TransferScreen, AmountEntryScreen,
      TopUpScreen, ProfileScreen, PocketsScreen, CreatePocketScreen,
      TransactionsScreen, ComingSoon, and the onboarding screens still
      have raw `text-[13px]`-style arbitrary values. The old values still
      work (this was additive, not a breaking rename), so this is safe to
      pick up incrementally rather than as one big sweep.
- [x] `QuickAction` takes a real `labelColor` prop (defaults to white,
      matching every current call site) instead of a hardcoded className.
      `src/components/QuickAction.tsx`
- [x] Date formatting now goes through one shared
      `formatRelativeDate()` (`src/utils/relativeDate.ts`). Mock
      transactions store a real `occurredAt` timestamp instead of a
      hand-written label string, so Home's recent list and PocketDetail's
      history render through identical logic. `src/data/mockTransactions.ts`

## Accessibility

- [x] Every icon-only `Pressable` app-wide now has an `accessibilityLabel`
      + `accessibilityRole="button"` (back buttons, bell, edit pencil,
      "+" create-pocket, numeric-keypad delete key, KTP/selfie capture
      buttons). `BottomNav`'s tabs also got `accessibilityRole="tab"` +
      `accessibilityState={{ selected }}` so a screen reader announces
      which tab is active, not just its name. Pressables that already had
      visible text (Cancel, Retake, View receipt, quick-amount chips,
      pocket rows) were left alone — the text already gives them an
      accessible name. Verified the labels reach the accessibility tree
      (checked via the web preview's `aria-label` output, which
      react-native-web derives directly from `accessibilityLabel`) and
      that nothing shifted visually — purely additive props, no layout
      changes.

## Testing / infra

- [ ] No automated test coverage at all — no test files, no test runner
      configured.
- [ ] No real backend — `src/data/*` is a synchronous mock-repository
      layer standing in for API calls. Fine for now; flag before this
      goes further than a prototype.

## Recently shipped (for context, not action)

Path aliases, App.tsx/navigation split, mock-data layer, Pockets tab,
Add Money flow, Withdraw/Add-recipient/notifications/More/PocketDetail-edit
placeholders, Receipt screen, real "Create a pocket" flow.
