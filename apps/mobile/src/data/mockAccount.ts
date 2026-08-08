import type { AccountSummary } from "./types";

const ACCOUNT_SUMMARY: AccountSummary = {
  balanceMinor: 824_050_000, // Rp 8.240.500
  accountMask: "•••• 4821",
};

export function getAccountSummary(): AccountSummary {
  return ACCOUNT_SUMMARY;
}
