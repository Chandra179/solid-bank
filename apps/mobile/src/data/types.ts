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
  // Weekly recurring auto-save amount, in minor units. Undefined/0 means
  // auto-save is off for this pocket. There's no real background
  // scheduler here (this is a synchronous mock layer) — PocketDetailScreen's
  // "Boost now" button applies one week's worth on demand instead, which is
  // an honest stand-in for "the weekly job ran" rather than pretending a
  // real cron exists.
  autoSaveMinor?: number;
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
  // Only meaningful for outgoing (negative) transactions — backs the
  // category breakdown in SpendingInsightsScreen. Incoming transactions
  // (salary, transfers in) don't get grouped into "spending."
  category?: string;
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
