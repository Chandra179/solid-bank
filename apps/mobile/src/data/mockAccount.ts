import type { AccountSummary } from "./types";

const ACCOUNT_SUMMARY: AccountSummary = {
  balanceMinor: 824_050_000, // Rp 8.240.500
  accountMask: "•••• 4821",
};

export function getAccountSummary(): AccountSummary {
  return ACCOUNT_SUMMARY;
}

// Backs VerifyPinScreen's submit() — previously nothing touched this at
// all (see TODO.md's documented limitation), so the main balance shown on
// Home never reflected a completed transfer, top-up, or withdrawal no
// matter how many of them a user walked through. Same mutate-in-place
// pattern as adjustPocketBalance; not clamped at 0 the way pockets are,
// since AmountEntryScreen already caps Transfer at the available balance
// client-side (a real backend would be the actual source of truth here).
export function adjustAccountBalance(deltaMinor: number): AccountSummary {
  ACCOUNT_SUMMARY.balanceMinor += deltaMinor;
  return ACCOUNT_SUMMARY;
}
