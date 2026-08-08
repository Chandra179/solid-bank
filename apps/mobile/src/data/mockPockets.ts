import type { Pocket } from "./types";

// Standing in for real API calls (GET /api/v1/pockets, GET
// /api/v1/pockets/:id) — the `pockets` package in apps/api/internal is
// still a stub, so there's nothing to fetch from yet. Kept synchronous
// (not Promise-wrapped) on purpose: screens call these directly during
// render rather than through a loading state, since forcing a fake-async
// shape onto data that's actually available instantly would just be
// busywork today. Swap the bodies for real `api.*` calls later — the
// function signatures are already what a data-fetching hook would want to
// wrap.
const POCKETS: Pocket[] = [
  { id: "pocket_1", name: "Emergency Fund", savedMinor: 240_000_000, targetMinor: 500_000_000 },
  { id: "pocket_2", name: "Bali Trip", savedMinor: 185_000_000, targetMinor: 600_000_000 },
  { id: "pocket_3", name: "New Laptop", savedMinor: 420_000_000, targetMinor: 1_200_000_000 },
];

export function listPockets(): Pocket[] {
  return POCKETS;
}

export function getPocket(id: string): Pocket | undefined {
  return POCKETS.find((p) => p.id === id);
}

let nextPocketSeq = POCKETS.length + 1;

// Backs CreatePocketScreen. Mutates the in-memory array directly (same
// spirit as everything else in this file being a stand-in for a real POST
// /api/v1/pockets) — new pockets always start at savedMinor: 0 since
// "create a pocket with money already in it" isn't a flow that exists;
// money only enters a pocket through Add Money afterward.
export function addPocket(name: string, targetMinor: number): Pocket {
  const pocket: Pocket = { id: `pocket_${nextPocketSeq++}`, name, savedMinor: 0, targetMinor };
  POCKETS.push(pocket);
  return pocket;
}

// Backs both Add Money (positive delta) and Withdraw (negative delta) once
// they actually move real money instead of just showing a Success screen —
// see VerifyPinScreen. Clamped at 0 rather than letting a pocket go
// negative; AmountEntryScreen already caps Withdraw's input at the current
// balance, this is the belt-and-suspenders backstop.
export function adjustPocketBalance(id: string, deltaMinor: number): Pocket | undefined {
  const pocket = POCKETS.find((p) => p.id === id);
  if (!pocket) return undefined;
  pocket.savedMinor = Math.max(0, pocket.savedMinor + deltaMinor);
  return pocket;
}

// Backs EditPocketScreen. Only name/target are editable — savedMinor only
// ever changes through adjustPocketBalance, never a direct edit, so a real
// balance can't be silently overwritten by a rename.
export function updatePocket(id: string, updates: { name?: string; targetMinor?: number }): Pocket | undefined {
  const pocket = POCKETS.find((p) => p.id === id);
  if (!pocket) return undefined;
  if (updates.name !== undefined) pocket.name = updates.name;
  if (updates.targetMinor !== undefined) pocket.targetMinor = updates.targetMinor;
  return pocket;
}
