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

export type RootStackParamList = {
  // Main app (isAuthenticated === true)
  Home: undefined;
  PocketDetail: { pocketId: string };
  Transfer: undefined;
  TopUp: undefined;
  AmountEntry: MoneyMoveContext;
  Confirm: MoneyMoveContext & { amountMinor: number };
  VerifyPin: MoneyMoveContext & { amountMinor: number };
  Success: { flow: MoneyFlow; contextLabel: string; amountMinor: number };
  MoneyMoveError: { reason: string };
  Profile: undefined;

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
