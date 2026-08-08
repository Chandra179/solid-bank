export type MoneyFlow = "transfer" | "topup" | "withdraw";

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
};

// What SuccessScreen and ReceiptScreen both need — VerifyPinScreen is the
// only place that generates `reference`/`completedAt`, at the moment a
// submission actually succeeds, so the receipt reflects when the money
// really moved rather than whenever the receipt happens to be viewed.
type CompletedMoneyMove = { flow: MoneyFlow; contextLabel: string; amountMinor: number; reference: string; completedAt: number };

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
  // have no real flow behind them yet. Only the sub-actions that are
  // genuinely separate, larger features (PIN reset re-auth, live support
  // chat) still route here — everything else has a real screen now.
  ComingSoon: {
    title: string;
    message: string;
    icon: "security" | "help";
  };
  // Real destination for Home's "Recent Transactions -> See all" link —
  // reuses the same listRecentTransactions() data Home's own preview list
  // already shows, just without the 3-item cap.
  Transactions: undefined;
  // QR-first payments entry point — resolves a scanned (mocked) QRIS code
  // to a merchant, then hands off into AmountEntry with flow: "transfer".
  QrScan: undefined;
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
  Security: undefined;
  // Static FAQ accordion, reached from Profile's Help row.
  Help: undefined;

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
