export type Card = {
  id: string;
  label: string;
  network: "Visa" | "Mastercard";
  last4: string;
  expiry: string; // "MM/YY"
  holderName: string;
  frozen: boolean;
  // Links this card to its matching row in mockFundingSources.ts — same
  // physical card, so freezing it here should actually affect whether
  // TopUpScreen can use it as a source, not just claim to in copy.
  fundingSourceId?: string;
};

// Standing in for a real GET /api/v1/cards call once card issuance sits
// behind a real BaaS/card-processor integration (per docs/ — card
// issuance is explicitly out of scope for a side-project BaaS
// integration, so this models a card the partner bank already issued,
// not self-service issuance). Deliberately the same Visa •••• 8842 that
// already appears as a funding source in mockFundingSources.ts — same
// physical card, viewed from two different screens, not two unrelated
// mock records that happen to share a network.
let CARDS: Card[] = [
  {
    id: "card_1",
    label: "Solid Debit",
    network: "Visa",
    last4: "8842",
    expiry: "09/29",
    holderName: "Jack",
    frozen: false,
    fundingSourceId: "src_card",
  },
];

export function listCards(): Card[] {
  return CARDS;
}

export function getCard(id: string): Card | undefined {
  return CARDS.find((c) => c.id === id);
}

// Freezing a card is a real, local, reversible toggle (like the biometric
// switch on SecurityScreen) — no backend needed to make it genuinely work
// within this mock layer, unlike issuing a new physical card or
// investigating a fraud report, which are left as honest ComingSoon gaps.
export function setCardFrozen(id: string, frozen: boolean): void {
  CARDS = CARDS.map((c) => (c.id === id ? { ...c, frozen } : c));
}