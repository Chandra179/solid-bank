import type { FundingSource } from "./types";

// Standing in for a real GET /api/v1/funding-sources call once the BaaS
// integration (apps/api/internal/baas) has a real provider behind it.
const FUNDING_SOURCES: FundingSource[] = [
  { id: "src_bank", name: "Linked Bank Account", subtitle: "BCA •••• 4821", kind: "bank" },
  { id: "src_card", name: "Debit Card", subtitle: "Visa •••• 8842", kind: "card" },
  // E-wallet top-up sources — GoPay/OVO/DANA are the three dominant SEA/
  // Indonesian e-wallets (see digital-bank-market-research.md's SEA
  // section), and arguably a more expected funding rail here than a debit
  // card given how QRIS/e-wallet-first the local payment landscape is.
  { id: "src_gopay", name: "GoPay", subtitle: "e-wallet · •62812••••678", kind: "ewallet" },
  { id: "src_ovo", name: "OVO", subtitle: "e-wallet · •62812••••678", kind: "ewallet" },
  { id: "src_dana", name: "DANA", subtitle: "e-wallet · •62812••••678", kind: "ewallet" },
];

export function listFundingSources(): FundingSource[] {
  return FUNDING_SOURCES;
}
