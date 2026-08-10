# TODO

Product/UX audit from a walkthrough of the running app (mock data, all screens
reachable from Welcome through onboarding, Home, Pockets, Transfer, QR Pay,
Top Up, Cards, Profile, Notifications). Organized as: concrete issues, gaps
against the SEA/Indonesia research docs, and new product ideas.

## Issues to fix

- [x] **KTP scan / selfie screens overflowed the viewport on web.** The app
      shell had no width cap, so on a desktop-width browser window,
      `KtpScanScreen`'s `aspect-[1.586] w-full` capture guide resolved its
      height off the full browser width — taller than the window itself —
      forcing the whole KYC step to scroll with the framing guide cut off
      top and bottom. Fixed by capping `#root` to a phone-width (430px)
      frame in `src/theme/global.css`, which is the general fix (protects
      every current and future screen that sizes off `w-full`), not a
      one-off patch to that screen. Native builds are unaffected — this is
      web-only CSS.
- [x] **Onboarding collected name and phone, then discarded them.**
      `ProfileSetupScreen` and `PhoneEntryScreen` both validated their input
      and then just navigated on without saving it anywhere — Profile
      always showed the hardcoded demo identity ("Jack", the original demo
      phone number) no matter what a real user typed during onboarding.
      Fixed by adding `updateUserProfile()` to the mock user layer and
      calling it from both screens' Continue handlers.
- [x] **Profile initials used the wrong slice.** `name.slice(0, 2)` takes
      the first two *characters* of the full name string, so "Jack Chandra"
      rendered as "JA" (from "Jack") instead of "JC". Fixed with a proper
      `getInitials()` util that takes the first letter of the first and
      last word for multi-word names, falling back to the old
      first-two-characters behavior only for a single-word name.
- [x] **Fee row read as an unset value, not a promise.** Confirm and
      Receipt both showed a flat "Rp 0" fee in the same neutral color as
      every other row — indistinguishable from a value nobody had wired up
      yet. Changed both to show "Free" in success green so a zero fee reads
      as deliberate.
- [x] **No real fee model behind that "Free."** Every flow was
      unconditionally fee-free with nothing deciding it. Resolved as a
      product decision (see `utils/fees.ts`): pocket moves, beneficiary
      transfers, and top-ups stay free (a differentiator, not a cost
      pass-through); QRIS pay is the one flow with a real fee behind it,
      currently waived by the "Zero-fee QRIS all week" promo referenced in
      `mockNotifications.ts` (`QRIS_PROMO_ACTIVE`, a stand-in for a real
      campaign/calendar check). `feeMinor` now flows through
      `MoneyMoveContext` (navigation/types.ts) from `QrScanScreen` — the one
      place that knows a transfer is a QRIS payment — through
      AmountEntry/Confirm/VerifyPin/Success/Receipt, so a nonzero fee (if
      the promo ever turns off) shows correctly everywhere instead of at
      just one screen.
- [x] **Pockets had no target date, and progress bars didn't vary.** Added
      `createdAt` (always set) and optional `targetDate` to `Pocket`
      (data/types.ts), a target-date field (validated `YYYY-MM-DD` text
      input, no date-picker dependency exists yet) on both
      CreatePocketScreen and EditPocketScreen, and `utils/pocketPacing.ts`,
      which compares elapsed-time-fraction to saved-fraction to color each
      pocket's progress bar green/amber/red (on-track/behind/overdue) and,
      on PocketDetailScreen, show a one-line status ("Behind pace — add
      more to catch up by..."). Pockets without a target date keep the old
      steady-green look — there's nothing to be "behind" without a
      deadline to measure against. Seed data varies all three states
      (Emergency Fund ahead, Bali Trip behind, New Laptop no target date)
      so every pacing state is reachable without creating new pockets.
- [x] **Mock actions didn't move the numbers they claimed to.** Added
      `adjustAccountBalance()` (mockAccount.ts) and `recordTransaction()`
      (mockTransactions.ts), and rewrote VerifyPinScreen's `submit()` to
      call them (alongside the existing `adjustPocketBalance`) for every
      flow: Add Money and Withdraw move value between the main balance and
      a pocket, top-up credits the main balance, and an external transfer
      or QRIS pay debits it — each with a matching Recent Transactions
      entry, plus a separate "QRIS fee" line when `feeMinor > 0`. Home,
      Pockets, and Transactions now actually reflect a completed action
      instead of only the Success/Receipt screens looking real.

## Gaps against SEA/Indonesia research

(See `research/indonesia-prep-checklist.md` and
`research/digital-bank-market-research.md` in the project for the source
reasoning behind these.)

- [x] **No e-wallet or QRIS top-up source.** Resolved — see "New product
      ideas" below.
- [x] **No bill payments (pulsa, PLN, BPJS).** Resolved — see "New product
      ideas" below.
- [x] **No budgeting/spend-insights surfaced from Home.** Resolved — see
      "New product ideas" below.
- **BI-FAST/interbank fee economics** — resolved as a product decision in
  the "Issues to fix" section above (`utils/fees.ts`): free by default,
  QRIS is the one flow with a real fee, currently promo-waived. Worth
  revisiting once there's a real BaaS partner contract to check the actual
  numbers against.

## New product ideas

**Segment decision:** freelancers/gig workers — chosen so shared pockets and
rewards below had a real wedge to anchor on, per the research docs' "pick
one segment" advice (they explicitly warned against building either before
one was picked). Worth revisiting if the project's audience turns out to
skew differently once there are real users.

- [x] **Surface Spending Insights from Home.** Added a "Spending insights"
      teaser row on HomeScreen (between the balance card and Your Pockets)
      showing the trailing-30-day spend total, tapping through to the
      existing `SpendingInsightsScreen` (which was already reachable from
      Transactions' header — this just gave Home itself a pointer to it
      too).
- [x] **E-wallet / QRIS top-up.** Added GoPay/OVO/DANA to
      `mockFundingSources.ts` with a new `FundingSource.kind` field
      ("bank"/"card"/"ewallet") and a dedicated wallet icon on TopUpScreen.
- [x] **Bill payments.** New top-level flow: `BillsScreen` (choose Pulsa/
      PLN/BPJS Kesehatan) → `BillInputScreen` (customer number). Pulsa is
      user-priced and hands off into the existing AmountEntry step; PLN/BPJS
      are bill-priced — a mock inquiry (`lookupMockBillAmount` in
      `data/mockBillers.ts`) resolves a fixed amount and skips straight to
      Confirm, the same dynamic-vs-static split QrScanScreen already uses
      for QRIS codes with a baked-in amount. New `"billpay"` `MoneyFlow`
      wired through Confirm/VerifyPin/Success/Receipt exactly like the other
      three flows — VerifyPinScreen debits the main balance and tags the
      transaction "Bills," so it folds into Spending Insights' breakdown.
- [x] **Pocket target dates + pacing — done, see "Issues to fix" above.**
      Extended further: the "Bali Trip is 31% funded"-style notification is
      no longer a hand-written mock entry — `generatePocketNotifications()`
      in `mockNotifications.ts` now derives one per pocket from its actual
      `getPocketPaceStatus()`, with message tone (behind/on-track/overdue)
      matching real state and read-tracking via a small module-level id set
      (generated notifications can't hold a persistent `read` field the way
      static ones do).
- [x] **Shared/group pockets.** `Pocket.participants` (data/types.ts) — a
      pocket can now list who's contributing to it and how much. Seeded one
      example ("Co-working Space," split three ways) so the feature is
      visible without creating one; `CreatePocketScreen` has a "Split with
      others" toggle + name chips to make a new one; `PocketDetailScreen`
      shows a "Shared with" section (avatars + contributed amounts) plus a
      "Request a contribution" action. That action is a genuine `ComingSoon`
      placeholder, not a real invite/notify flow — participants are
      display/mock data, not backed by real multi-user accounts.
- [x] **Segment-specific rewards/cashback.** `data/mockRewards.ts` computes
      cashback from real spend categories (bonus rates on Subscriptions/
      Food & Drink/Transport — the categories a freelancer actually spends
      on — rather than a flat generic rate), and lists three perks anchored
      to the same segment (co-working discount, business-tool trial, cafe
      QRIS cashback) rather than a generic points mall. New `RewardsScreen`,
      reached from a "Rewards" row on Profile.

## Scalability / UX engineering pass

Follow-up from a senior UI/UX + frontend design review of the app as it
stood after the product-ideas pass above. Each item below was a concern
raised in that review.

- [x] **Real caching/invalidation layer, replacing `useRefreshOnFocus`.**
      Added `@tanstack/react-query` (now a real dependency — run `npm
      install` before starting the dev server again) and a query layer in
      `src/data/queries.ts`: one hook per resource (`usePockets()`,
      `useAccountSummary()`, etc.) plus a single `useInvalidateData()` every
      mutation calls right after it writes. Migrated all 7 screens that used
      to poll for changes via `useFocusEffect` + a local counter
      (CardsScreen, TransferScreen, PocketDetailScreen, TopUpScreen,
      HomeScreen, TransactionsScreen, PocketsScreen), and wired invalidation
      into every mutation site (PIN-verified money moves, pocket create/
      edit/boost, card freeze, adding a recipient, marking a notification
      read, and the onboarding profile-update steps). `useRefreshOnFocus` is
      retired — the hook file stays for reference but nothing imports it
      anymore. See `docs/conventions.md`'s "Data fetching" section for the
      pattern going forward.
- [x] **PIN no longer stored in plaintext.** `store/session.ts` now holds
      `hashPin(pin)` (a synchronous FNV-1a hash in the new
      `src/utils/pinHash.ts`), not the raw digits, and exposes
      `setPin(rawPin)` / `verifyPin(rawPin)` instead of a raw `pin` field —
      VerifyPinScreen and ChangePinScreen both go through `verifyPin` now.
      Still explicitly a demo simplification, not real security (see the
      comments in both files for exactly what this does and doesn't
      protect against) — a real build verifies a PIN server-side or via the
      device's secure enclave, never a client-side hash compare.
- [x] **Home's action row is a scalable grid, not a squeeze-to-fit row.**
      Was `flex-row justify-between`, which silently re-spaced every icon
      each time one was added (visible when Bills went in as a 5th item).
      Now a fixed-width (`25%`) `flex-wrap` grid — the next action added
      grows a second row instead of squeezing the first. Pockets moved to
      row 2 since it's already one tap away via `BottomNav`'s own tab, which
      freed a first-row slot for Bills without costing an extra tap in the
      common case.
- [x] **Shared `LoadingState` component, applied everywhere a query can be
      mid-fetch.** New `src/components/LoadingState.tsx` — one spinner
      pattern (full-screen or `inline`), used as the loading guard on every
      screen migrated to the query hooks above, plus BillInputScreen's mock
      bill-inquiry "checking" state (the one real async round-trip in this
      app today).
- [x] **`docs/conventions.md`** — written down the IA and loading-state
      rules above (data fetching/invalidation, loading states, Home's
      action-row grid, PIN handling) so the next screen someone adds follows
      the same shape instead of re-deriving it.
- [x] **Vitest + unit tests for core money-movement logic.** Added `vitest`
      (`npm run test` / `npm run test:watch`), a standalone
      `vitest.config.ts` (deliberately separate from `vite.config.ts` — the
      RN-web plugin stack there doesn't apply to plain-TS unit tests, and
      loading it through `vitest/config`'s own `defineConfig` sidesteps an
      ESM/CJS resolution conflict this repo's non-`"type": "module"`
      `package.json` otherwise hits). 69 tests across the actual
      money-movement primitives: `adjustAccountBalance`/`adjustPocketBalance`
      (mockAccount.ts/mockPockets.ts — the functions VerifyPinScreen calls on
      every completed transfer/top-up/withdrawal/bill payment), `addPocket`/
      `updatePocket`, `recordTransaction`/`recordPocketTransaction`/
      `getCategoryBreakdown`, plus the supporting pure logic those depend on
      (`formatIDR`/`formatSignedIDR`, `getQrisFeeMinor`, `getPocketPaceStatus`/
      `getPocketPaceMessage`, `parseDateInput`/`formatDateInput`,
      `hashPin`, and the new i18n `t()`). Removed the dangling `@types/jest`
      devDependency (nothing used it) and dropped `"jest"` from
      `tsconfig.json`'s `types`.
- [ ] **Migrate `BottomNav` to real `@react-navigation/bottom-tabs`** — still
      not done; the real library is an installed-but-unused dependency while
      `components/BottomNav.tsx` is still hand-rolled.
- [x] **i18n infrastructure, defaulting to Bahasa Indonesia.** New
      `src/i18n/` — `locales/id.ts` (default) and `locales/en.ts` (fallback,
      `satisfies` id.ts's inferred shape so the two locale files can't drift
      out of sync), a `t(key, params)` function with dot-path keys
      autocompleted/type-checked against id.ts (`moneyMove.flow.transfer.
      successTitle`, not a raw string), `{{token}}` interpolation, and a
      `useTranslation()` hook backed by a small Zustand store (so a future
      language switcher just needs to call `setLocale` — every call site
      already re-renders on change). Wired through the highest-traffic
      "core flow" paths: `WelcomeScreen`, `HomeScreen`'s header/quick-actions/
      spending-insights/pockets/transactions copy, `getGreeting()`, and the
      whole Confirm → VerifyPin → Success chain via `moneyFlowCopy.ts` (one
      central lookup already fed all three of those screens' flow-specific
      copy, so translating it there localizes that entire chain in one
      place) plus `VerifyPinScreen`'s own title/subtitle/error copy. Every
      other screen (Transfer, TopUp, Bills, Pockets, Cards, Profile,
      onboarding beyond Welcome, etc.) is still hardcoded English — extending
      `id.ts`/`en.ts` with those screens' strings and swapping in `t()` calls
      is mechanical repetition of the same pattern, not a design question,
      so it's left as follow-up rather than done half-consistently here.
- [x] **Design-system debt: hardcoded colors, icon-size drift, an
      undocumented spacing scale.** An audit across every screen/component
      found: two hardcoded hex colors with no token equivalent
      (`CreatePocketScreen`'s border, `ProfileScreen`'s pending-verification
      badge — added `colors.warning100` for the latter); `IconPocket`/
      `IconSearch` rendered a size or two off the established convention in
      a few badges/empty-states (`CreatePocketScreen`, `EditPocketScreen`,
      `TransferScreen`); and `theme/spacing.ts`'s own comment claimed
      `gap: 6`/`gap: 10` were one-off values, when in fact they're real,
      load-bearing scale steps used across a dozen+ files each — registered
      as `spacing.xxs`/`spacing.sm2` rather than left undocumented. Back-
      button pattern, header-row variants, EmptyState/LoadingState adoption,
      and Button variant usage were all already consistent — no changes
      needed there. Left as a conscious scope decision: the ~15+ existing
      literal `gap: 6`/`gap: 10` usages were not swapped to reference the
      new tokens — same numeric value either way, so that's pure mechanical
      churn with no visual or functional difference.
- [x] **WCAG 2.1 AA pass.** An audit against 1.4.1 (Use of Color), 1.4.3/
      1.4.11 (Contrast), 2.5.5 (Target Size), 4.1.2 (Name/Role/Value), and
      4.1.3 (Status Messages) found and fixed: `success500`/`warning500`
      failed 4.5:1 as *text* on white (they're fine as fills, which only
      need 3:1) — added `success600`/`warning600`/`warning100` text-safe
      variants and swapped them in everywhere those colors labeled text
      (`ProfileScreen`'s verification badge, `pocketPacing.ts`'s new
      `pocketPaceTextColor()`); `ComingSoon`'s caption used `neutral400`
      (2.56:1, fails) instead of `neutral500` (4.76:1); 31 files' icon-button
      back/action `Pressable`s were `h-10 w-10` (40px, under the 44px
      minimum) — bumped to `h-11 w-11` app-wide; every pocket's progress bar
      conveyed its on-track/behind/overdue pace through color alone with no
      text fallback — `pocketPacing.ts` gained `pocketPaceShortLabel()`,
      now wired into `PocketCard.tsx` as a caption next to the "saved of
      target" line; `NumericKeypad`'s digit keys had no
      `accessibilityRole`/`accessibilityLabel` (only the delete key did) —
      added to all of them; and PIN-entry error text (`VerifyPinScreen`,
      `ChangePinScreen`/`ChangePinNewScreen`/`ChangePinConfirmScreen`,
      onboarding's `ConfirmPinScreen`, `OtpScreen`) had no
      `accessibilityLiveRegion`, so a screen reader user wouldn't hear
      "PINs don't match" unless they happened to re-focus that text — added
      `accessibilityLiveRegion="assertive"` to all of them. Moderate-priority
      item still open: `TextInput`s across `CreatePocketScreen`,
      `ProfileSetupScreen`, `AddRecipientScreen`, `TransferScreen`,
      `BillInputScreen`, `EditPocketScreen` still rely on visible labels/
      placeholders without an explicit `accessibilityLabel` (3.3.2/1.3.1) —
      lower severity than the fixes above since sighted-label association
      already works, left as follow-up.
- [x] **i18n coverage extended to nearly every remaining screen.** Added
      ~30 new namespaced key groups to `id.ts`/`en.ts` (`transfer`,
      `amountEntry`, `bills`, `cards`, `changePin`/`changePinNew`/
      `changePinConfirm`, `confirm`, `contactSupport`, `errorScreen`,
      `help` (incl. its FAQ copy), `notificationSettings`, `profile`,
      `qrScan`, `receipt`, `rewards`, `security`, `spendingInsights`,
      `success`, `nav` (BottomNav's tab labels), `pocketCard`, and a full
      `onboarding.*` tree for every onboarding screen past Welcome —
      `phoneEntry`, `otp`, `ktpScan`, `selfie`, `kycPending`, `setPin`,
      `confirmPin`, `complete`) and wired `t()`/`useTranslation()` calls
      through all of them, closing the gap the previous i18n pass left
      open. Also added the `pocketPace.*` keys `pocketPacing.ts` already
      called `t()` with mid-session (that file was translated before the
      corresponding locale keys existed) and updated
      `pocketPacing.test.ts`'s assertions from the old hardcoded-English
      strings to the id-locale ones `getPocketPaceMessage()` now actually
      returns by default. `SpendingInsights`' transaction-count line needed
      real pluralization (English "1 transaction" vs "2 transactions" —
      Indonesian doesn't inflect for plural) — handled with a `{{suffix}}`
      param computed in the caller rather than extending the `t()` system's
      interpolation to a full ICU/plural-rules library for one call site.
      Still not translated, discovered too late in this pass to fold in:
      `ComingSoon`, `TopUpScreen`, `AddRecipientScreen`,
      `TransactionsScreen`, `NotificationsScreen`, `EditPocketScreen`,
      `PocketDetailScreen`, `CreatePocketScreen`, `ProfileSetupScreen`, and
      `BillInputScreen` — none of these import `t()` yet, so their screen
      copy (beyond the "Go back" accessibility label, fixed everywhere via
      the WCAG touch-target sed pass) is still hardcoded English. Left as
      the next i18n follow-up rather than rushed through unread.
