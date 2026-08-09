// Product decision, documented in TODO.md: Solid Bank doesn't pass through
// interbank/pocket transfer costs — moving money between your own pockets,
// sending to a beneficiary, and topping up are all free, treated as a
// product differentiator rather than a BI-FAST-cost-plus-margin line item.
// QRIS pay is the one flow with a real per-transaction cost behind it
// (merchants pay MDR on QRIS transactions; some of that is a plausible
// candidate for passing through to the payer). Right now it's waived by
// the "Zero-fee QRIS all week" promo already referenced in
// data/mockNotifications.ts — QRIS_PROMO_ACTIVE is this mock's stand-in for
// "today falls inside that promo's window" until there's a real
// campaign/calendar system to check against instead of a hardcoded flag.
const QRIS_PROMO_ACTIVE = true;
const QRIS_BASE_FEE_MINOR = 100_000; // Rp 1.000 — standing in for a real MDR-based calculation

// Only QrScanScreen calls this — it's the one place in the app that knows
// "this transfer is a QRIS payment" rather than a beneficiary transfer or
// pocket move, so the fee is decided once, there, and carried through
// AmountEntry -> Confirm -> VerifyPin -> Success -> Receipt as `feeMinor`
// rather than re-derived at each of those screens.
export function getQrisFeeMinor(): number {
  return QRIS_PROMO_ACTIVE ? 0 : QRIS_BASE_FEE_MINOR;
}
