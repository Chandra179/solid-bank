// Amounts are stored as integer minor units (sen) per the ledger's
// convention (see apps/api/internal/ledger) — divide by 100 before
// display. Previously copy-pasted (with small drift — some copies didn't
// have a signed variant) into PocketCard, HomeScreen, SuccessScreen,
// ConfirmScreen, PocketDetailScreen, ReceiptScreen, and TransactionRow.
// This is the one canonical version everything should import now.
export function formatIDR(minor: number): string {
  return `Rp ${Math.round(minor / 100).toLocaleString("id-ID")}`;
}

// Same formatting, with an explicit +/- sign — used for transaction rows
// where the direction of money matters (incoming vs outgoing), not just
// the total.
export function formatSignedIDR(minor: number): string {
  const sign = minor < 0 ? "-" : "+";
  return `${sign}${formatIDR(Math.abs(minor))}`;
}
