import type { TranslationShape } from "./id";

// English — the fallback locale, and the language every string in this app
// was originally hardcoded in before this file existed (see
// src/i18n/index.ts). `satisfies TranslationShape` (not `: TranslationShape`)
// so this stays a literal-typed object — a missing/extra key here is a type
// error against id.ts's shape, but callers still get the literal string
// union types id.ts's own `t()` usage relies on for autocomplete.
const en = {
  common: {
    continue: "Continue",
    cancel: "Cancel",
    save: "Save",
    goBack: "Go back",
    seeAll: "See all",
    comingSoon: "Coming soon",
  },
  greeting: {
    night: "Good night",
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
  },
  welcome: {
    appName: "Solid Bank",
    tagline: "Save toward your goals, move money, and keep everything in one place.",
    getStarted: "Get Started",
    haveAccount: "I already have an account",
  },
  home: {
    subtitle: "Here's your account today",
    totalBalance: "Total balance",
    quickActions: {
      topUp: "Top Up",
      transfer: "Transfer",
      qrPay: "QR Pay",
      bills: "Bills",
      pockets: "Pockets",
    },
    spendingInsights: "Spending insights",
    spendingInsightsSubtitle: "{{amount}} spent in the last 30 days",
    yourPockets: "Your Pockets",
    recentTransactions: "Recent Transactions",
    noPockets: "No pockets yet",
    noPocketsSubtitle: "Create a pocket to start saving toward a goal.",
    createPocket: "Create a pocket",
    noTransactions: "No transactions yet",
    noTransactionsSubtitle: "Your activity will show up here once you top up or spend.",
  },
  moneyMove: {
    flowNoun: {
      transfer: "transfer",
      withdraw: "withdrawal",
      billpay: "payment",
      topup: "top up",
    },
    verifyPinTitle: "Enter your PIN",
    verifyPinSubtitle: "Confirm it's you before this {{flowNoun}} goes through.",
    confirming: "Confirming…",
    incorrectPin: "Incorrect PIN. Try again.",
    noPinSetUp: "No PIN is set up on this device. Go back and try again.",
    flow: {
      transfer: { reviewVerb: "You're sending", preposition: "To", successTitle: "Transfer successful", typeLabel: "Transfer" },
      topup: { reviewVerb: "You're topping up", preposition: "From", successTitle: "Top up successful", typeLabel: "Top Up" },
      withdraw: { reviewVerb: "You're withdrawing", preposition: "From", successTitle: "Withdrawal successful", typeLabel: "Withdraw" },
      billpay: { reviewVerb: "You're paying", preposition: "For", successTitle: "Payment successful", typeLabel: "Bill Payment" },
    },
  },
} satisfies TranslationShape;

export default en;
