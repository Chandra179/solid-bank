// Barrel for the mock-repository layer. Screens should import from "@/data"
// rather than reaching into individual mockX.ts files — that's what makes
// swapping any one of these for a real API call later an internal change to
// this directory instead of a call-site hunt across every screen.
export * from "./types";
export { listPockets, getPocket, addPocket, adjustPocketBalance, updatePocket } from "./mockPockets";
export {
  listRecentTransactions,
  listPocketTransactions,
  recordPocketTransaction,
  recordTransaction,
  getCategoryBreakdown,
} from "./mockTransactions";
export type { CategoryBreakdown } from "./mockTransactions";
export { listBeneficiaries, addBeneficiary } from "./mockBeneficiaries";
export { listFundingSources } from "./mockFundingSources";
export { getAccountSummary, adjustAccountBalance } from "./mockAccount";
export { getUserProfile, updateUserProfile } from "./mockUser";
export { resolveMockQrCode } from "./mockMerchants";
export { listNotifications, getUnreadNotificationCount, markNotificationRead } from "./mockNotifications";
export { listCards, getCard, setCardFrozen } from "./mockCards";
export type { Card } from "./mockCards";
export { submitSupportMessage } from "./mockSupportMessages";
export { listBillers, getBiller, lookupMockBillAmount, PULSA_DENOMINATIONS_RUPIAH } from "./mockBillers";
export type { Biller, BillType } from "./mockBillers";
export { getRewardsSummary, getCashbackRate, listPerks } from "./mockRewards";
export type { RewardsSummary, Perk } from "./mockRewards";