import type { Transaction } from "./types";

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: "tx_1", name: "Kopi Kenangan", dateLabel: "Today, 09:41", amountMinor: -3_200_000 },
  { id: "tx_2", name: "Salary — Acme Co.", dateLabel: "Yesterday, 08:00", amountMinor: 650_000_000 },
  { id: "tx_3", name: "Transfer to Pockets", dateLabel: "Yesterday, 07:58", amountMinor: -50_000_000 },
];

// Keyed by pocket id, and deliberately real per-pocket data rather than one
// shared list. PocketDetailScreen previously rendered the same hardcoded
// MOCK_HISTORY array regardless of which pocket you navigated to — so
// Bali Trip and New Laptop silently showed Emergency Fund's transactions.
// pocket_2/pocket_3 are left empty here rather than copying pocket_1's
// three entries, which also makes PocketDetailScreen's EmptyState actually
// reachable by visiting either of them (it wasn't before: every pocket had
// "history").
const POCKET_HISTORY: Record<string, Transaction[]> = {
  pocket_1: [
    { id: "h1", name: "Transfer from Main", dateLabel: "3 days ago", amountMinor: 50_000_000 },
    { id: "h2", name: "Auto-save (weekly)", dateLabel: "1 week ago", amountMinor: 20_000_000 },
    { id: "h3", name: "Withdraw to Main", dateLabel: "2 weeks ago", amountMinor: -15_000_000 },
  ],
  pocket_2: [],
  pocket_3: [],
};

export function listRecentTransactions(): Transaction[] {
  return RECENT_TRANSACTIONS;
}

export function listPocketTransactions(pocketId: string): Transaction[] {
  return POCKET_HISTORY[pocketId] ?? [];
}
