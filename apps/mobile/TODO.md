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
- [x] Home, Pockets, PocketDetail, and now Transfer refresh their mock-data
      reads on focus (`useFocusEffect` + a re-render counter), so e.g. a
      pocket created via CreatePocketScreen or a beneficiary added via
      AddRecipientScreen shows up immediately on goBack instead of needing
      a full remount.
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
- [ ] QR Pay currently only supports "static" QRIS codes (merchant + no
      preset amount, user types it in). Real QRIS also has "dynamic" codes
      that encode a fixed amount — `resolveMockQrCode()` would need an
      optional `amountMinor` that, when present, skips AmountEntry and
      goes straight to Confirm.
- [ ] Other product directions considered but not built this round:
      spending insights/budgeting (category breakdown of transactions) and
      pocket auto-save/boost (a real growth mechanic on top of the
      already-built Pockets feature).

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
