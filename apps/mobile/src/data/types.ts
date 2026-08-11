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
  // When this pocket was created — the reference point pacing measures
  // elapsed time from (see utils/pocketPacing.ts: expected progress is
  // elapsed-since-createdAt over targetDate-minus-createdAt). Always set,
  // unlike targetDate, since "no pacing" and "no creation time" aren't the
  // same thing — a pocket with no goal date still has a real start date.
  createdAt: number;
  // Optional goal deadline, in ms epoch. Pockets without one render with
  // steady, non-evaluative progress (no "behind schedule" framing is
  // possible without a date to measure against) — see PocketCard/
  // PocketDetailScreen for how targetDate presence changes the progress
  // bar's color.
  targetDate?: number;
  // Shared/group pockets — the freelancer/gig-worker wedge this project
  // anchored on (per the research docs' "pick one wedge" advice) regularly
  // splits costs with other independent workers: a shared co-working
  // membership, a joint client-project buffer, a pooled emergency fund
  // among a small collective. Undefined means "not shared," same
  // optional-field convention as autoSaveMinor/targetDate. `contributedMinor`
  // per participant is illustrative/mock — there's no real multi-user auth
  // or contribution-tracking backend behind this yet, so it's additive
  // display data rather than something this layer reconciles against
  // savedMinor. `requestedAt` backs PocketDetailScreen's per-participant
  // "Request a contribution" action (see mockPockets.ts's
  // requestPocketContribution) — genuinely real within what this mock layer
  // can do (records that a request happened, flips the row to a "Requested"
  // state), short of an actual push/notify to another real account, which
  // needs multi-user auth this app doesn't have.
  participants?: { id: string; name: string; contributedMinor: number; requestedAt?: number }[];
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
  // Defaults to "bank" for existing sources (via the fallback in
  // TopUpScreen's icon lookup) rather than being required everywhere —
  // only e-wallet sources need to opt into a different icon/treatment.
  // SEA digital banks (Jago, SeaBank, Blu — see the market-research doc)
  // all treat e-wallet top-up as a first-class funding rail alongside
  // linked bank accounts, not an afterthought.
  kind?: "bank" | "card" | "ewallet";
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
