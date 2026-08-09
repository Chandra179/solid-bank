import type { BillType } from "@/data/mockBillers";

export type MoneyFlow = "transfer" | "topup" | "withdraw" | "billpay";

// Shared params for the AmountEntry -> Confirm -> Success chain. Both the
// Transfer and Top Up entry points feed into this same three-screen tail,
// distinguished only by `flow` (see docs on why: shared amount/confirm/
// success UI, distinct destination/source pickers).
type MoneyMoveContext = {
  flow: MoneyFlow;
  contextId?: string;
  contextLabel: string;
  contextSubLabel?: string;
  // Caps the amount the user can enter — e.g. Withdraw is capped at the
  // source pocket's current balance rather than the account-wide max.
  // AmountEntryScreen falls back to the account balance for `transfer` when
  // this is absent, so existing Transfer/Top Up callers don't need to change.
  maxAmountMinor?: number;
  // Set only by QrScanScreen (via utils/fees.ts) — every other entry point
  // (pocket moves, beneficiary transfers, top-ups) is free by product
  // decision (see utils/fees.ts) and leaves this undefined, which
  // Confirm/Receipt both treat the same as 0.
  feeMinor?: number;
};

// What SuccessScreen and ReceiptScreen both need — VerifyPinScreen is the
// only place that generates `reference`/`completedAt`, at the moment a
// submission actually succeeds, so the receipt reflects when the money
// really moved rather than whenever the receipt happens to be viewed.
type CompletedMoneyMove = {
  flow: MoneyFlow;
  contextLabel: string;
  amountMinor: number;
  feeMinor?: number;
  reference: string;
  completedAt: number;
};

export type RootStackParamList = {
  // Main app (isAuthenticated === true)
  Home: undefined;
  PocketDetail: { pocketId: string };
  Transfer: undefined;
  TopUp: undefined;
  AmountEntry: MoneyMoveContext;
  Confirm: MoneyMoveContext & { amountMinor: number };
  VerifyPin: MoneyMoveContext & { amountMinor: number };
  Success: CompletedMoneyMove;
  Receipt: CompletedMoneyMove;
  MoneyMoveError: { reason: string };
  Profile: undefined;
  Pockets: undefined;
  CreatePocket: undefined;
  Cards: undefined;
  // Generic placeholder destination for actions that are UI-complete but
  // have no real flow behind them yet. PIN reset and "contact support" both
  // got real screens (ChangePin*/ContactSupport below) — the remaining
  // uses are Cards' "Report lost or stolen" (needs a real fraud-ops
  // workflow) and "Order a new card" (needs real issuance/logistics),
  // genuinely separate features rather than something to fake.
  ComingSoon: {
    title: string;
    message: string;
    icon: "security" | "help" | "card";
  };
  // Real destination for Home's "Recent Transactions -> See all" link —
  // reuses the same listRecentTransactions() data Home's own preview list
  // already shows, just without the 3-item cap.
  Transactions: undefined;
  // QR-first payments entry point — resolves a scanned (mocked) QRIS code
  // to a merchant, then hands off into AmountEntry with flow: "transfer".
  QrScan: undefined;
  // Bill payments entry point — a top-level flow alongside Transfer/Top
  // Up/QR Pay per TODO.md's product-idea writeup, listing the three
  // billers (Pulsa/PLN/BPJS) called out as a near-universal gap.
  Bills: undefined;
  // Customer-number entry for one biller. Pulsa hands off into AmountEntry
  // (flow: "billpay") since the user picks how much credit to buy; PLN/BPJS
  // look up a fixed bill amount and hand off straight into Confirm instead
  // (same dynamic-vs-static split QrScanScreen already uses for QRIS codes).
  BillInput: { billType: BillType };
  // Category breakdown of the last 30 days' spending, sourced from the
  // same RECENT_TRANSACTIONS list Home/Transactions already read from.
  SpendingInsights: undefined;
  // Real activity feed behind Home's bell icon.
  Notifications: undefined;
  // Per-category push toggles, reached from Profile's Notifications row.
  NotificationSettings: undefined;
  // Add-a-beneficiary form, reached from Transfer's "Add new recipient".
  AddRecipient: undefined;
  // Rename/re-target an existing pocket, reached from PocketDetail's pencil.
  EditPocket: { pocketId: string };
  // Device/biometric security settings, reached from Profile's Security row.
  // `pinJustChanged` is set only when ChangePinConfirmScreen navigates back
  // here after a successful reset, to show a one-time confirmation banner.
  Security: { pinJustChanged?: boolean } | undefined;
  // Static FAQ accordion, reached from Profile's Help row.
  Help: undefined;
  // Real PIN-reset re-auth chain, reached from Security's "Change PIN" row.
  // Three steps rather than reusing onboarding's SetPin/ConfirmPin pair
  // directly: those two screens live in the unauthenticated Stack.Group,
  // and RootNavigator's whole design deliberately keeps exactly one group
  // mounted at a time (see its own comment) so an onboarding screen can
  // never be reachable once logged in, or vice versa. Dedicated screens
  // that reuse the same DigitEntry/NumericKeypad components get the same
  // UX without crossing that boundary.
  ChangePin: undefined;
  ChangePinNew: undefined;
  ChangePinConfirm: { newPin: string };
  // "Send us a message" form, reached from Help's "Contact support" row —
  // a real (if backend-less) alternative to the live-chat widget that's
  // still a genuine ComingSoon gap.
  ContactSupport: undefined;
  // Freelancer-segment cashback + partner-perks screen, reached from
  // Profile's "Rewards" row. See utils/rewards.ts / data/mockRewards.ts.
  Rewards: undefined;

  // Onboarding (isAuthenticated === false)
  Welcome: undefined;
  PhoneEntry: undefined;
  Otp: { phone: string };
  ProfileSetup: undefined;
  KtpScan: undefined;
  Selfie: undefined;
  KycPending: undefined;
  SetPin: undefined;
  ConfirmPin: { pin: string };
  OnboardingComplete: undefined;
};