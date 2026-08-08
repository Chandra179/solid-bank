import type { Beneficiary } from "./types";

const BENEFICIARIES: Beneficiary[] = [
  { id: "ben_1", name: "Sarah Putri", subtitle: "•••• 1092 · BCA" },
  { id: "ben_2", name: "Andi Wijaya", subtitle: "•••• 4471 · Mandiri" },
  { id: "ben_3", name: "Kos Melati (Rent)", subtitle: "•••• 2201 · BNI" },
];

export function listBeneficiaries(): Beneficiary[] {
  return BENEFICIARIES;
}

let nextBeneficiarySeq = BENEFICIARIES.length + 1;

// Backs AddRecipientScreen. `subtitle` is pre-formatted by the caller (e.g.
// "•••• 1234 · BCA") to match the existing entries' shape rather than this
// function reconstructing it from separate bank/account fields.
export function addBeneficiary(name: string, subtitle: string): Beneficiary {
  const beneficiary: Beneficiary = { id: `ben_${nextBeneficiarySeq++}`, name, subtitle };
  BENEFICIARIES.push(beneficiary);
  return beneficiary;
}
