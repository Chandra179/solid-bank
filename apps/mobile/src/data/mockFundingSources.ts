import type { FundingSource } from "./types";

// Standing in for a real GET /api/v1/funding-sources call once the BaaS
// integration (apps/api/internal/baas) has a real provider behind it.
const FUNDING_SOURCES: FundingSource[] = [
  { id: "src_bank", name: "Linked Bank Account", subtitle: "BCA •••• 4821" },
  { id: "src_card", name: "Debit Card", subtitle: "Visa •••• 8842" },
];

export function listFundingSources(): FundingSource[] {
  return FUNDING_SOURCES;
}
