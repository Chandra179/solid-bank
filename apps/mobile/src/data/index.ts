// Barrel for the mock-repository layer. Screens should import from "@/data"
// rather than reaching into individual mockX.ts files — that's what makes
// swapping any one of these for a real API call later an internal change to
// this directory instead of a call-site hunt across every screen.
export * from "./types";
export { listPockets, getPocket, addPocket, adjustPocketBalance, updatePocket } from "./mockPockets";
export { listRecentTransactions, listPocketTransactions } from "./mockTransactions";
export { listBeneficiaries, addBeneficiary } from "./mockBeneficiaries";
export { listFundingSources } from "./mockFundingSources";
export { getAccountSummary } from "./mockAccount";
export { getUserProfile } from "./mockUser";
export { resolveMockQrCode } from "./mockMerchants";
export { listNotifications, getUnreadNotificationCount, markNotificationRead } from "./mockNotifications";
