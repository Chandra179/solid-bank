import type { MoneyFlow } from "@/navigation/types";

type FlowCopy = {
  reviewVerb: string; // ConfirmScreen's "You're ___"
  preposition: "To" | "From";
  successTitle: string; // SuccessScreen
  typeLabel: string; // ReceiptScreen's "Type" row
};

// Was three separate `flow === "transfer" ? a : b` ternaries duplicated
// across Confirm/Success/Receipt — fine for two flows, but adding
// "withdraw" would have meant a third branch in three different places.
// One lookup table instead, same spirit as utils/currency.ts.
const COPY: Record<MoneyFlow, FlowCopy> = {
  transfer: { reviewVerb: "You're sending", preposition: "To", successTitle: "Transfer successful", typeLabel: "Transfer" },
  topup: { reviewVerb: "You're topping up", preposition: "From", successTitle: "Top up successful", typeLabel: "Top Up" },
  withdraw: { reviewVerb: "You're withdrawing", preposition: "From", successTitle: "Withdrawal successful", typeLabel: "Withdraw" },
  billpay: { reviewVerb: "You're paying", preposition: "For", successTitle: "Payment successful", typeLabel: "Bill Payment" },
};

export function getMoneyFlowCopy(flow: MoneyFlow): FlowCopy {
  return COPY[flow];
}
