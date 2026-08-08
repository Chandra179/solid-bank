export type MoneyFlow = "transfer" | "topup";

// Shared params for the AmountEntry -> Confirm -> Success chain. Both the
// Transfer and Top Up entry points feed into this same three-screen tail,
// distinguished only by `flow` (see docs on why: shared amount/confirm/
// success UI, distinct destination/source pickers).
type MoneyMoveContext = {
  flow: MoneyFlow;
  contextId?: string;
  contextLabel: string;
  contextSubLabel?: string;
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
  // have no real flow behind them yet (Withdraw, adding a recipient
  // manually). `icon` is a key rather than a React element so this stays a
  // plain serializable params object like every other route here.
  ComingSoon: {
    title: string;
    message: string;
    icon: "withdraw" | "recipient" | "notifications" | "more" | "edit" | "security" | "help";
  };
  // Real destination for Home's "Recent Transactions -> See all" link —
  // reuses the same listRecentTransactions() data Home's own preview list
  // already shows, just without the 3-item cap.
  Transactions: undefined;

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
