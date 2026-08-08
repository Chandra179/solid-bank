import type { Beneficiary } from "./types";

const BENEFICIARIES: Beneficiary[] = [
  { id: "ben_1", name: "Sarah Putri", subtitle: "•••• 1092 · BCA" },
  { id: "ben_2", name: "Andi Wijaya", subtitle: "•••• 4471 · Mandiri" },
  { id: "ben_3", name: "Kos Melati (Rent)", subtitle: "•••• 2201 · BNI" },
];

export function listBeneficiaries(): Beneficiary[] {
  return BENEFICIARIES;
}
