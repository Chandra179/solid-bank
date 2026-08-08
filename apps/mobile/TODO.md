# TODO

A living backlog of known gaps, reconstructed from ongoing UI/UX + code
audits. Check items off in commits as they're closed; add new ones as
they're found rather than re-discovering them from scratch next session.

## UX / product gaps

- [ ] Home's greeting ("Good morning, Jack") is hardcoded, not time-of-day
      aware. `src/screens/HomeScreen.tsx`
- [ ] Home's "Recent Transactions → See all" link is a dead tap (no
      onPress). No dedicated all-transactions screen exists yet — needs
      one, or route to ComingSoon in the meantime. `src/screens/HomeScreen.tsx`
- [ ] Screens don't refresh mock data on focus. E.g. create a pocket, go
      back to the Pockets list — it still shows the old count until the
      screen is torn down and remounted. Same gap likely affects Home's
      balance after Add Money. No navigation focus listeners exist
      anywhere in the app yet.
- [ ] No real settings surface (Security / Notifications / Help) —
      intentionally left off Profile rather than added as dead rows; still
      a gap, just a bigger one (new screens, not a quick wire-up).
      `src/screens/ProfileScreen.tsx`

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
