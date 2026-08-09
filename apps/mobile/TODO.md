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

- **No e-wallet or QRIS top-up source.** `TopUpScreen` only offers a linked
  bank account or debit card. GoPay/OVO/DANA e-wallet top-up and QRIS-based
  top-up are extremely common funding rails in Indonesia — arguably more
  expected than card top-up for this market.
- **No bill payments (pulsa, PLN, BPJS).** A near-universal feature in
  Indonesian banking/fintech apps, and currently absent from the nav
  entirely.
- **No budgeting/spend-insights surfaced from Home.** `SpendingInsightsScreen`
  already exists in the codebase (category breakdown, reads from the same
  transaction list Home does) but isn't linked from Home or the bottom nav
  — it's a real, finished screen that's currently unreachable in normal
  navigation. Low-effort fix: add an entry point.
- **BI-FAST/interbank fee economics** — resolved as a product decision in
  the "Issues to fix" section above (`utils/fees.ts`): free by default,
  QRIS is the one flow with a real fee, currently promo-waived. Worth
  revisiting once there's a real BaaS partner contract to check the actual
  numbers against.

## New product ideas

Roughly in priority order:

- **Surface Spending Insights from Home.** Already built, just needs a
  visible entry point — the cheapest win on this list.
- **E-wallet / QRIS top-up.** Add GoPay/OVO/DANA-style sources to
  `TopUpScreen`'s "Choose a source" list.
- **Bill payments.** Pulsa (phone credit), PLN (electricity), BPJS —
  probably as a new top-level flow alongside Transfer/Top Up/QR Pay.
- **Pocket target dates + pacing — done, see "Issues to fix" above.** Next
  step if this gets picked up further: make the existing "Bali Trip is 31%
  funded" notification generate itself from real pace state (it's still a
  static mock entry in `mockNotifications.ts`) instead of being a
  hand-written example.
- **Shared/group pockets.** Split a savings goal with others — common in
  SEA super-app-adjacent products. Lower priority; only worth it once a
  specific target segment (per the research docs' "pick one wedge" advice)
  is chosen, since it's exactly the kind of breadth-over-depth feature the
  research warns against building too early.
- **Segment-specific rewards/cashback.** Same caveat as above — tie it to
  one chosen segment rather than a generic points system.
