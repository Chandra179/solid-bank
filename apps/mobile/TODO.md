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

- [ ] `formatIDR` is copy-pasted in 6 files (PocketCard, HomeScreen,
      SuccessScreen, ConfirmScreen, PocketDetailScreen, ReceiptScreen)
      instead of one shared util.
- [ ] No typography/spacing token system — `theme/colors.ts` exists with
      no equivalent for type scale or spacing, so screens use ad hoc
      Tailwind values.
- [ ] `QuickAction`'s label color is hardcoded white — only works on the
      brand-colored balance card, would break if reused anywhere else.
      `src/components/QuickAction.tsx`
- [ ] Date-format inconsistency: Home/mockTransactions use "Today, 09:41"
      style, PocketDetail history uses "3 days ago" style. Needs one
      shared relative-date util. `src/data/mockTransactions.ts`

## Accessibility

- [ ] Zero `accessibilityLabel` usage anywhere in the app — every
      icon-only Pressable (back buttons, bell, edit, more, header icons)
      is invisible to screen readers. Real gap for a financial app.

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
