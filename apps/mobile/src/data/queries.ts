// React Query layer over the mock data repository (@/data). Replaces the
// old useRefreshOnFocus pattern (see hooks/useRefreshOnFocus.ts, kept for
// reference but no longer used by any screen) — instead of every screen
// blindly re-running every one of its own reads on every navigation focus,
// reads go through a shared cache keyed by resource, and a mutation site
// invalidates that cache once, right after its write.
//
// Every read function here is still synchronous under the hood (this is a
// mock layer, not a real API) — React Query is used for the caching/
// invalidation model regardless, since that's the actual thing this file
// exists to fix, not the presence or absence of real network latency. When
// these mock functions become real `fetch` calls, the query hooks below
// don't need to change shape at all, which is the point.
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAccountSummary,
  listPockets,
  listRecentTransactions,
  listPocketTransactions,
  listNotifications,
  getUserProfile,
  listCards,
  listFundingSources,
  listBeneficiaries,
  getCategoryBreakdown,
} from "./index";

// Namespaced under "data" so a future real API's own React Query usage
// (once these become fetch calls) doesn't collide with keys this mock
// layer already claimed, and so useInvalidateData's broad
// invalidateQueries({ queryKey: ["data"] }) call has one common prefix to
// match against.
export const queryKeys = {
  account: ["data", "account"] as const,
  pockets: ["data", "pockets"] as const,
  transactions: ["data", "transactions"] as const,
  pocketTransactions: (pocketId: string) => ["data", "pocketTransactions", pocketId] as const,
  notifications: ["data", "notifications"] as const,
  user: ["data", "user"] as const,
  cards: ["data", "cards"] as const,
  fundingSources: ["data", "fundingSources"] as const,
  beneficiaries: ["data", "beneficiaries"] as const,
  categoryBreakdown: (days: number) => ["data", "categoryBreakdown", days] as const,
};

export function useAccountSummary() {
  return useQuery({ queryKey: queryKeys.account, queryFn: getAccountSummary });
}

export function usePockets() {
  return useQuery({ queryKey: queryKeys.pockets, queryFn: listPockets });
}

export function useRecentTransactions() {
  return useQuery({ queryKey: queryKeys.transactions, queryFn: listRecentTransactions });
}

export function usePocketTransactions(pocketId: string) {
  return useQuery({
    queryKey: queryKeys.pocketTransactions(pocketId),
    queryFn: () => listPocketTransactions(pocketId),
  });
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: listNotifications });
}

export function useUserProfile() {
  return useQuery({ queryKey: queryKeys.user, queryFn: getUserProfile });
}

export function useCards() {
  return useQuery({ queryKey: queryKeys.cards, queryFn: listCards });
}

export function useFundingSources() {
  return useQuery({ queryKey: queryKeys.fundingSources, queryFn: listFundingSources });
}

export function useBeneficiaries() {
  return useQuery({ queryKey: queryKeys.beneficiaries, queryFn: listBeneficiaries });
}

export function useCategoryBreakdown(days: number) {
  return useQuery({ queryKey: queryKeys.categoryBreakdown(days), queryFn: () => getCategoryBreakdown(days) });
}

// Every mutation in this app (VerifyPinScreen's submit, pocket create/edit/
// boost, card freeze, adding a recipient, updating the profile during
// onboarding, marking a notification read) writes directly into one of the
// in-memory arrays in data/mock*.ts. Call this once, right after that
// write, instead of the removed forceRefresh-a-local-counter pattern.
//
// Deliberately invalidates every "data"-prefixed key rather than exposing
// one narrower helper per exact mutation shape: a real API-backed version
// of each call site would know precisely which resource its own endpoint
// touched, but every write in this mock layer is a cheap in-memory array
// mutation, so the correctness risk of under-invalidating (a screen quietly
// going stale) outweighs the performance cost of over-invalidating a
// handful of cheap queries. Splitting this into narrower invalidation
// groups is a reasonable follow-up once a specific query proves expensive
// enough to matter.
export function useInvalidateData() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["data"] });
  };
}
