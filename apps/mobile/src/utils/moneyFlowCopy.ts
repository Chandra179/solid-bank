import type { MoneyFlow } from "@/navigation/types";
import { t } from "@/i18n";

type FlowCopy = {
  reviewVerb: string; // ConfirmScreen's "You're ___"
  preposition: string; // ConfirmScreen's "To"/"From"/"For" row label — real, rendered copy, so it's translated too
  successTitle: string; // SuccessScreen
  typeLabel: string; // ReceiptScreen's "Type" row
};

// ConfirmScreen renders `copy.preposition` directly as on-screen text (the
// "To"/"From"/"For" label next to the recipient/source name), so — unlike
// TransferScreen's own `To ${name}`-style contextLabel strings, which are
// plain English scaffolding stripped back out via regex before display —
// this is real user-facing copy and has to go through i18n like the other
// three fields. Was three separate `flow === "transfer" ? a : b` ternaries
// duplicated across Confirm/Success/Receipt before this file existed;
// translating each independently would have reintroduced that same
// duplication one locale file at a time, so this stays the single lookup
// point, now backed by id.ts/en.ts's moneyMove.flow.* keys instead of
// hardcoded strings.
export function getMoneyFlowCopy(flow: MoneyFlow): FlowCopy {
  return {
    reviewVerb: t(`moneyMove.flow.${flow}.reviewVerb`),
    preposition: t(`moneyMove.flow.${flow}.preposition`),
    successTitle: t(`moneyMove.flow.${flow}.successTitle`),
    typeLabel: t(`moneyMove.flow.${flow}.typeLabel`),
  };
}
