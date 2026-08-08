// Shapes shared by the mock repository (this directory) and the screens
// that consume it. Consolidated here instead of living next to whichever
// component first needed them (PocketCard/TransactionRow used to each
// declare their own) — Home, PocketDetail, Transfer, and Top Up all need
// the same Pocket/Transaction/Beneficiary/FundingSource shapes, so one
// shared definition is what keeps them from drifting apart.
export type Pocket = {
  id: string;
  name: string;
  savedMinor: number;
  targetMinor: number;
};

// Deliberately has no `icon` field — which icon a transaction renders with
// is a presentation decision made where the row is drawn (see
// TransactionRow.tsx), not part of the underlying data a real API would
// return.
export type Transaction = {
  id: string;
  name: string;
  dateLabel: string;
  amountMinor: number; // positive = incoming/credit, negative = outgoing/debit
};

export type Beneficiary = {
  id: string;
  name: string;
  subtitle: string;
};

export type FundingSource = {
  id: string;
  name: string;
  subtitle: string;
};

export type AccountSummary = {
  balanceMinor: number;
  accountMask: string;
};

export type KycStatus = "pending" | "verified";

export type UserProfile = {
  name: string;
  phone: string;
  kycStatus: KycStatus;
};
