import { getCategoryBreakdown } from "./mockTransactions";

// Cashback rates tuned to the freelancer/gig-worker wedge this project
// anchored on (see indonesia-prep-checklist.md's "pick one segment" advice
// and TODO.md's own caution against a generic points system) — rewarding
// the categories that segment actually spends on (client-meeting coffee,
// business subscriptions/tools, getting between gigs) rather than treating
// every rupiah the same. Everything else still earns a small base rate
// rather than nothing, so the summary isn't just three categories and a
// wall of zeros.
const CASHBACK_RATE_BY_CATEGORY: Record<string, number> = {
  Subscriptions: 0.02,
  "Food & Drink": 0.01,
  Transport: 0.01,
};
const DEFAULT_CASHBACK_RATE = 0.0025;

export type RewardsSummary = {
  cashbackEarnedMinor: number;
  periodDays: number;
};

// Computed the same way SpendingInsightsScreen's own breakdown is (same
// underlying RECENT_TRANSACTIONS, same trailing-window filter) rather than
// a separately-tracked points balance — cashback earned should always
// reconcile against what was actually spent, not drift from it.
export function getRewardsSummary(periodDays = 30): RewardsSummary {
  const breakdown = getCategoryBreakdown(periodDays);
  const cashbackEarnedMinor = breakdown.reduce((sum, c) => {
    const rate = CASHBACK_RATE_BY_CATEGORY[c.category] ?? DEFAULT_CASHBACK_RATE;
    return sum + Math.round(c.totalMinor * rate);
  }, 0);
  return { cashbackEarnedMinor, periodDays };
}

export function getCashbackRate(category: string): number {
  return CASHBACK_RATE_BY_CATEGORY[category] ?? DEFAULT_CASHBACK_RATE;
}

export type Perk = {
  id: string;
  title: string;
  description: string;
  category?: string;
};

// Partner perks, anchored to the freelancer segment rather than generic
// "10% off shopping" offers — a co-working discount, a business-tool trial,
// and automatic QRIS cashback at cafes (a common freelancer "office") are
// the kind of everyday-relevant perks Jenius's freelancer positioning (see
// digital-bank-market-research.md) leans on, not a mass-market points mall.
const PERKS: Perk[] = [
  {
    id: "perk_coworking",
    title: "10% off co-working day passes",
    description: "At partner spaces — useful for client meetings away from home.",
    category: "Transport",
  },
  {
    id: "perk_tools",
    title: "1 month free on business tools",
    description: "A trial credit toward invoicing/accounting software subscriptions.",
    category: "Subscriptions",
  },
  {
    id: "perk_coffee",
    title: "2% cashback on coffee shop QRIS pay",
    description: "Automatic — no code needed when you pay by QRIS at a participating cafe.",
    category: "Food & Drink",
  },
];

export function listPerks(): Perk[] {
  return PERKS;
}
