// Standing in for a real biller-aggregator integration (Xendit/Midtrans both
// offer bill-payment APIs covering these exact three categories — see
// indonesia-prep-checklist.md's vendor shortlist) once apps/api grows a
// billpay package. Pulsa/PLN/BPJS are called out by name in TODO.md's own
// gap analysis as "a near-universal feature in Indonesian banking/fintech
// apps" that was missing entirely.
export type BillType = "pulsa" | "pln" | "bpjs";

export type Biller = {
  type: BillType;
  name: string;
  subtitle: string;
  customerLabel: string;
  placeholder: string;
  // Pulsa is user-priced (like Top Up) — you choose how much credit to buy.
  // PLN/BPJS are bill-priced — the amount due is whatever the biller says it
  // is, not something the user types in (see lookupMockBillAmount below).
  amountMode: "user-entered" | "billed";
};

const BILLERS: Record<BillType, Biller> = {
  pulsa: {
    type: "pulsa",
    name: "Pulsa",
    subtitle: "Phone credit — any Indonesian carrier",
    customerLabel: "Phone number",
    placeholder: "0812xxxxxxxx",
    amountMode: "user-entered",
  },
  pln: {
    type: "pln",
    name: "PLN",
    subtitle: "Electricity bill",
    customerLabel: "Customer / meter ID",
    placeholder: "12-digit ID number",
    amountMode: "billed",
  },
  bpjs: {
    type: "bpjs",
    name: "BPJS Kesehatan",
    subtitle: "Health insurance premium",
    customerLabel: "BPJS participant number",
    placeholder: "13-digit number",
    amountMode: "billed",
  },
};

export function listBillers(): Biller[] {
  return Object.values(BILLERS);
}

export function getBiller(type: BillType): Biller {
  return BILLERS[type];
}

// Common pulsa top-up denominations — mirrors AmountEntryScreen's own
// quick-amount chip pattern (50rb/100rb/500rb) but with the four amounts an
// actual Indonesian carrier top-up menu offers.
export const PULSA_DENOMINATIONS_RUPIAH = [25_000, 50_000, 100_000, 200_000];

// Deterministic mock "check my bill" lookup for PLN/BPJS: hashes the
// customer number into a plausible Rp 100.000–400.000 range so the same
// customer number always returns the same mock bill instead of a new
// random amount on every lookup (a real integration would call the
// aggregator's bill-inquiry endpoint here instead).
export function lookupMockBillAmount(customerNumber: string): number {
  let hash = 0;
  for (let i = 0; i < customerNumber.length; i++) {
    hash = (hash * 31 + customerNumber.charCodeAt(i)) >>> 0;
  }
  const rupiah = 100_000 + (hash % 300_000);
  return rupiah * 100;
}
