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
- [x] Home, Pockets, PocketDetail, Transfer, and Transactions refresh their
      mock-data reads on focus, so e.g. a pocket created via
      CreatePocketScreen or a beneficiary added via AddRecipientScreen
      shows up immediately on goBack instead of needing a full remount.
      The `useState` + `useFocusEffect` block was previously copy-pasted
      into all five screens individually; it's now one shared
      `useRefreshOnFocus()` hook (`src/hooks/useRefreshOnFocus.ts`), so
      there's one implementation to keep in sync instead of five.
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
      **Now swept app-wide** — the remaining 19 screens/components a
      design audit flagged (TransferScreen, AmountEntryScreen, TopUpScreen,
      ProfileScreen, CreatePocketScreen, EditPocketScreen,
      AddRecipientScreen, VerifyPinScreen, ErrorScreen, ComingSoon, and
      every onboarding screen) had their raw `text-[11px]`/`text-[13px]`/
      `text-[15px]` values swapped 1:1 for `text-caption`/`text-body`/
      `text-label`. Pure token substitution — the underlying px values are
      unchanged, so nothing shifted visually. `Rp` currency-prefix glyphs
      and the OTP-resend countdown kept their raw sizing since they're
      decorative/disabled-state text, not body copy.
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

## Coming-soon placeholders — now real

- [x] **Withdraw from a pocket** (`PocketDetailScreen.tsx`) now reuses the
      AmountEntry → Confirm → VerifyPin → Success → Receipt chain with a new
      `flow: "withdraw"`, capped at the pocket's current balance via a new
      `maxAmountMinor` context field (`AmountEntryScreen.tsx` falls back to
      the mock account balance for `transfer` when it's absent, so existing
      callers didn't need to change). This surfaced — and fixed — a real
      gap: **VerifyPinScreen's `submit()` had never mutated any balance for
      any flow**, including the existing Add Money button. It now calls a
      new `adjustPocketBalance()` (`src/data/mockPockets.ts`) for both Add
      Money and Withdraw when the money move targets one of the user's own
      pockets (disambiguated by whether `contextId` resolves via
      `getPocket()`). Confirm/Success/Receipt's per-flow copy ("You're
      sending" vs "top up" vs "withdrawing", etc.) was pulled into one
      `getMoneyFlowCopy()` lookup (`src/utils/moneyFlowCopy.ts`) instead of
      tripling the existing two-way ternaries in three files.
      **Scope limits, by design**: the main account balance
      (`mockAccount.ts`) is *not* mutated by any flow — only
      `Pocket.savedMinor` is real now — and no transaction-history entry is
      auto-inserted when a balance changes. Both are flagged here rather
      than silently building a partial shadow ledger.
- [x] **Edit pocket** (PocketDetail's pencil icon) — real
      `EditPocketScreen.tsx`, same name+goal form as CreatePocketScreen,
      pre-filled and calling a new `updatePocket()`. Can't touch
      `savedMinor` directly — that only ever changes through
      `adjustPocketBalance`, so a rename can't silently wipe a real balance.
- [x] **Add a new recipient** (Transfer screen) — real
      `AddRecipientScreen.tsx` (name, bank chip picker, account number),
      calling a new `addBeneficiary()`. TransferScreen now also refreshes
      on focus so a newly added beneficiary shows up immediately on
      `goBack()`, matching the pattern Home/Pockets/PocketDetail already use.
- [x] **Notifications** (Home's bell icon) — real activity feed
      (`NotificationsScreen.tsx` + new `src/data/mockNotifications.ts`),
      tap-to-mark-read, plus an unread-count red dot on the bell itself.
- [x] **Security** (Profile) — real `SecurityScreen.tsx`: a genuine local
      biometric-login toggle and a static "this device" row. "Change PIN"
      still routes to the generic ComingSoon placeholder — a real PIN reset
      needs the same re-auth ceremony as onboarding's SetPin/ConfirmPin
      pair, which today only exists in the unauthenticated `Stack.Group`;
      reusing it here is a real navigator restructuring, scoped out of this
      pass rather than half-built.
- [x] **Notification preferences** (Profile) — real
      `NotificationSettingsScreen.tsx`, per-category toggles, fully local
      state (no backend to persist to yet, same as everywhere in `src/data`).
- [x] **Help** (Profile) — real `HelpScreen.tsx`, a static FAQ accordion.
      "Contact support" still routes to ComingSoon — live support chat is a
      genuinely separate feature, not something worth faking with a dead
      form.

With this batch shipped, `ComingSoon`'s icon union (and `ComingSoonScreen`'s
`ICONS` map) is down to just `"security" | "help"` — the two sub-actions
above that are still honestly unbuilt. Every other not-built-yet
destination that used to land on the generic placeholder now has a real
screen.

## Product roadmap

- [x] **QR-first payments** (`src/screens/QrScanScreen.tsx`) — the project's
      own research (`docs/digital_bank_indonesia_prep_checklist.md`) names
      three product priorities: savings pockets (done), instant e-KYC
      (done), and "QRIS as default, not an afterthought" — the one that was
      completely missing. Home's "More" quick action (no real
      functionality behind it) was replaced with "QR Pay" so it sits in the
      primary action row rather than a step deeper. Scans a mocked QRIS
      code (`resolveMockQrCode()` in `src/data/mockMerchants.ts`, standing
      in for a real camera/QR-decode library — same caveat as
      KtpScanScreen/SelfieLivenessScreen), auto-resolves after a short
      delay (passive scan, not tap-to-capture — real QR scanning doesn't
      wait for a tap), then hands off into the existing
      AmountEntry → Confirm → VerifyPin → Success → Receipt chain with
      `flow: "transfer"`, reusing the whole pipeline rather than growing a
      parallel one.
- [x] QR Pay now supports "dynamic" QRIS codes, not just "static" ones.
      `QrMerchant` (`src/data/mockMerchants.ts`) gained an optional
      `amountMinor` — present, it's a dynamic code (the amount is fixed by
      whoever generated it, e.g. Indomaret's checkout code); absent, it's
      static and the payer types the amount in, same as before.
      `QrScanScreen.tsx` branches on it: dynamic skips `AmountEntry`
      entirely and goes straight to `Confirm` with the fixed amount; static
      is unchanged.
- [x] **Pocket auto-save/boost** — `Pocket` gained an optional
      `autoSaveMinor` (a weekly recurring amount; undefined/0 = off), set
      via a new field on `EditPocketScreen.tsx` and cleared by leaving it at
      0. There's no real background scheduler in this mock layer, so
      PocketDetailScreen shows a "Boost now" button when auto-save is on —
      an honest stand-in for "the weekly job ran," applying one week's
      amount on demand via `adjustPocketBalance()` and, unlike Add
      Money/Withdraw, also recording a real history entry via a new
      `recordPocketTransaction()` (`src/data/mockTransactions.ts`), since a
      boost has no separate Success/Receipt screen to be the record of what
      happened. When auto-save is off, the same spot shows a dashed
      "Set up auto-save" card linking to Edit pocket instead.
- [x] **Spending insights/budgeting** — `SpendingInsightsScreen.tsx`, a
      category breakdown of the trailing 30 days' spending, reached from a
      new icon button on `TransactionsScreen.tsx`'s header. `Transaction`
      gained an optional `category` field; a new `getCategoryBreakdown()`
      (`src/data/mockTransactions.ts`) sums outgoing amounts by category,
      excluding incoming transactions and pocket transfers (moving money
      into a pocket isn't "spending" it). Mock data for this — and for
      `TransactionsScreen`'s fuller feed — grew from 3 to 8 entries;
      `HomeScreen`'s preview is now explicitly capped at 3 (`.slice(0, 3)`)
      so its "recent" list stays a short preview rather than growing with
      the richer dataset underneath it.

## Design audit fixes

A senior UI/UX pass (documented separately, not checked in) flagged six
issues; all are now addressed:

- [x] **Every `Button` rendered with no visible fill/border.**
      `Button.tsx` wrapped its pill styling directly on
      `Animated.createAnimatedComponent(Pressable)`; in at least one render
      path that wrapper wasn't processing its NativeWind `className`, so
      every primary/secondary/danger button (including the Welcome
      screen's "Get Started" and ErrorScreen's "Try Again") rendered as
      invisible text with no chrome. Fixed by moving all visual styling
      onto a plain, non-animated inner `View`; `AnimatedPressable` now only
      owns the touch target and the opacity fade. Still worth a real
      on-device check — this can only be confirmed as fixed in the same
      web-preview harness the bug was found in.
- [x] **Welcome screen's "Get Started" sat flush against the left edge,
      uncentered.** Same root cause as above — fixed as a side effect of
      the `Button` change, since it was the button's own missing
      `items-center`/padding, not a WelcomeScreen layout bug.
- [x] **AmountEntry screens had ~300-400px of dead space** between the
      quick-amount chips and the keypad (Withdraw/Transfer/TopUp/QR Pay all
      share this screen). Changed the amount block from
      `justify-center` to `justify-end`, pulling it down next to the
      keypad instead of floating in the vertical middle.
- [x] **Contrast: some real (non-placeholder) captions used
      `text-slate-400`**, under WCAG AA's 4.5:1 minimum on white — the
      AmountEntry context sub-label, Spending Insights' "spent across N
      categories," ErrorScreen's "No money has left your account," and
      notification timestamps. Bumped those four to `text-slate-500`.
      Left `Rp` currency-prefix glyphs and the OTP-resend countdown at
      `slate-400` — those are decorative/disabled-state text, not content.
- [x] **Dead white space below short lists** (Top Up's 2 sources,
      Notifications' handful of items). Added a real, honest closing note
      pinned to the bottom of each screen ("More funding sources coming
      soon." / "That's everything for now.") instead of leaving the space
      inert. Cards (ComingSoon) and Help were left as-is — Cards is a
      deliberately calm empty state, and Help already has real content
      density between its FAQ list and the "Contact support" row.
      `PocketDetailScreen`'s Withdraw button affordance (no visible chrome
      beyond the styling bug) is resolved by the `Button` fix above — worth
      a second look once that's verified on-device.

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
