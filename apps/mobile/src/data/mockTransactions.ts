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

const RECENT_TRANSACTIONS: RawTransaction[] = [
  { id: "tx_1", name: "Kopi Kenangan", occurredAt: NOW - 3 * HOUR, amountMinor: -3_200_000 },
  { id: "tx_2", name: "Salary — Acme Co.", occurredAt: NOW - DAY - 4 * HOUR, amountMinor: 650_000_000 },
  { id: "tx_3", name: "Transfer to Pockets", occurredAt: NOW - DAY - 4 * HOUR - 2 * 60 * 1000, amountMinor: -50_000_000 },
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
