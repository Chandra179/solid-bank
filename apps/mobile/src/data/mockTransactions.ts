import type { Transaction } from "./types";
import { formatRelativeDate } from "@/utils/relativeDate";

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
// Captured once at module load rather than per-call — these are mock
// "when did this happen" timestamps, not something that should shift
// mid-session every time a screen re-renders.
const NOW = Date.now();

// Raw shape stores a real timestamp instead of a hand-written label — see
// utils/relativeDate.ts. dateLabel is computed from it below, once, so
// Home's recent list and PocketDetail's history both render through the
// same formatting logic instead of two independently hardcoded styles
// ("Today, 09:41" vs "3 days ago") drifting apart.
type RawTransaction = Omit<Transaction, "dateLabel"> & { occurredAt: number };

// A few more entries than before, spread across the last couple weeks and
// tagged with `category` — enough for SpendingInsightsScreen's breakdown to
// show more than one or two categories. HomeScreen only previews the first
// 3 (still the "recent" list it always was); this full list is what
// TransactionsScreen and the insights breakdown both read from.
const RECENT_TRANSACTIONS: RawTransaction[] = [
  { id: "tx_1", name: "Kopi Kenangan", occurredAt: NOW - 3 * HOUR, amountMinor: -3_200_000, category: "Food & Drink" },
  { id: "tx_2", name: "Salary — Acme Co.", occurredAt: NOW - DAY - 4 * HOUR, amountMinor: 650_000_000, category: "Income" },
  { id: "tx_3", name: "Transfer to Pockets", occurredAt: NOW - DAY - 4 * HOUR - 2 * 60 * 1000, amountMinor: -50_000_000, category: "Savings" },
  { id: "tx_4", name: "Indomaret", occurredAt: NOW - 2 * DAY, amountMinor: -8_500_000, category: "Groceries" },
  { id: "tx_5", name: "Netflix", occurredAt: NOW - 3 * DAY, amountMinor: -18_600_000, category: "Subscriptions" },
  { id: "tx_6", name: "Grab", occurredAt: NOW - 4 * DAY, amountMinor: -3_200_000, category: "Transport" },
  { id: "tx_7", name: "Warung Nasi Padang", occurredAt: NOW - 5 * DAY, amountMinor: -4_500_000, category: "Food & Drink" },
  { id: "tx_8", name: "PLN — Electricity", occurredAt: NOW - 6 * DAY, amountMinor: -22_000_000, category: "Bills" },
];

// Keyed by pocket id, and deliberately real per-pocket data rather than one
// shared list. PocketDetailScreen previously rendered the same hardcoded
// MOCK_HISTORY array regardless of which pocket you navigated to — so
// Bali Trip and New Laptop silently showed Emergency Fund's transactions.
// pocket_2/pocket_3 are left empty here rather than copying pocket_1's
// three entries, which also makes PocketDetailScreen's EmptyState actually
// reachable by visiting either of them (it wasn't before: every pocket had
// "history").
const POCKET_HISTORY: Record<string, RawTransaction[]> = {
  pocket_1: [
    { id: "h1", name: "Transfer from Main", occurredAt: NOW - 3 * DAY, amountMinor: 50_000_000 },
    { id: "h2", name: "Auto-save (weekly)", occurredAt: NOW - 7 * DAY, amountMinor: 20_000_000 },
    { id: "h3", name: "Withdraw to Main", occurredAt: NOW - 14 * DAY, amountMinor: -15_000_000 },
  ],
  pocket_2: [],
  pocket_3: [],
};

function withLabel(tx: RawTransaction): Transaction {
  const { occurredAt, ...rest } = tx;
  return { ...rest, dateLabel: formatRelativeDate(occurredAt) };
}

export function listRecentTransactions(): Transaction[] {
  return RECENT_TRANSACTIONS.map(withLabel);
}

export function listPocketTransactions(pocketId: string): Transaction[] {
  return (POCKET_HISTORY[pocketId] ?? []).map(withLabel);
}

let nextHistorySeq = 1;

// Backs PocketDetailScreen's "Boost now" (auto-save) button — previously
// nothing that changed a pocket's balance ever left a matching history
// entry (see TODO.md's documented limitation), which made the balance
// change look unexplained. This closes that gap specifically for
// auto-save boosts, the one balance-changing action that isn't already
// part of the Add Money/Withdraw chain (those still don't record history —
// unlike a scheduled auto-save "boost," they already get their own
// Success/Receipt confirmation, so a history row would be a duplicate
// record of the same event rather than the only record of it).
export function recordPocketTransaction(pocketId: string, name: string, amountMinor: number): void {
  const entry: RawTransaction = { id: `hb_${nextHistorySeq++}`, name, occurredAt: Date.now(), amountMinor };
  if (!POCKET_HISTORY[pocketId]) POCKET_HISTORY[pocketId] = [];
  POCKET_HISTORY[pocketId].unshift(entry);
}

export type CategoryBreakdown = { category: string; totalMinor: number; count: number };

// Backs SpendingInsightsScreen. Only looks at RECENT_TRANSACTIONS (the main
// account's activity, not per-pocket history) and only groups outgoing
// (negative) amounts — "Income" and "Savings" transfers aren't spending.
// `periodDays` filters to a trailing window rather than "all time," since a
// budgeting view is normally scoped to "this month," not the account's
// entire history.
export function getCategoryBreakdown(periodDays = 30): CategoryBreakdown[] {
  const since = NOW - periodDays * DAY;
  const totals = new Map<string, { totalMinor: number; count: number }>();
  for (const tx of RECENT_TRANSACTIONS) {
    if (tx.amountMinor >= 0) continue; // not spending
    if (tx.occurredAt < since) continue;
    if (tx.category === "Savings") continue; // moving money to a pocket isn't "spending" it
    const category = tx.category ?? "Other";
    const existing = totals.get(category) ?? { totalMinor: 0, count: 0 };
    existing.totalMinor += Math.abs(tx.amountMinor);
    existing.count += 1;
    totals.set(category, existing);
  }
  return Array.from(totals.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.totalMinor - a.totalMinor);
}
