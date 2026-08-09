import { describe, expect, it } from "vitest";
import { addPocket, adjustPocketBalance, getPocket, listPockets, updatePocket } from "./mockPockets";

describe("addPocket", () => {
  it("starts a new pocket at savedMinor: 0 regardless of the target", () => {
    const pocket = addPocket("Test Goal", 1_000_000_00);
    expect(pocket.savedMinor).toBe(0);
    expect(pocket.targetMinor).toBe(1_000_000_00);
  });

  it("assigns a unique id and makes the pocket findable via getPocket", () => {
    const pocket = addPocket("Findable Goal", 500_000_00);
    expect(getPocket(pocket.id)).toEqual(pocket);
  });

  it("appends to the list rather than replacing it", () => {
    const before = listPockets().length;
    addPocket("Another Goal", 100_000_00);
    expect(listPockets().length).toBe(before + 1);
  });

  it("with no participant names, creates a solo pocket (no participants field)", () => {
    const pocket = addPocket("Solo Goal", 100_000_00);
    expect(pocket.participants).toBeUndefined();
  });

  it("with participant names, adds 'You' plus each named participant at 0 contributed", () => {
    const pocket = addPocket("Shared Goal", 300_000_00, undefined, ["Rani", "Deni"]);
    expect(pocket.participants).toHaveLength(3);
    expect(pocket.participants?.[0]).toEqual({ id: "you", name: "You", contributedMinor: 0 });
    expect(pocket.participants?.map((p) => p.name)).toEqual(["You", "Rani", "Deni"]);
  });
});

describe("adjustPocketBalance", () => {
  it("increases savedMinor by a positive delta", () => {
    const pocket = addPocket("Add Money Target", 1_000_000_00);
    adjustPocketBalance(pocket.id, 200_000_00);
    expect(getPocket(pocket.id)?.savedMinor).toBe(200_000_00);
  });

  it("decreases savedMinor by a negative delta (a withdrawal)", () => {
    const pocket = addPocket("Withdraw Target", 1_000_000_00);
    adjustPocketBalance(pocket.id, 500_000_00);
    adjustPocketBalance(pocket.id, -200_000_00);
    expect(getPocket(pocket.id)?.savedMinor).toBe(300_000_00);
  });

  it("clamps at 0 rather than letting a pocket go negative", () => {
    const pocket = addPocket("Clamped Target", 1_000_000_00);
    adjustPocketBalance(pocket.id, 100_000_00);
    adjustPocketBalance(pocket.id, -999_999_00);
    expect(getPocket(pocket.id)?.savedMinor).toBe(0);
  });

  it("returns undefined for an unknown pocket id without throwing", () => {
    expect(adjustPocketBalance("does-not-exist", 100)).toBeUndefined();
  });
});

describe("updatePocket", () => {
  it("updates name and targetMinor when provided", () => {
    const pocket = addPocket("Old Name", 100_000_00);
    updatePocket(pocket.id, { name: "New Name", targetMinor: 200_000_00 });
    const updated = getPocket(pocket.id);
    expect(updated?.name).toBe("New Name");
    expect(updated?.targetMinor).toBe(200_000_00);
  });

  it("never touches savedMinor — only adjustPocketBalance can change it", () => {
    const pocket = addPocket("Balance Guard", 1_000_000_00);
    adjustPocketBalance(pocket.id, 400_000_00);
    updatePocket(pocket.id, { name: "Renamed", targetMinor: 2_000_000_00 });
    expect(getPocket(pocket.id)?.savedMinor).toBe(400_000_00);
  });

  it("stores autoSaveMinor > 0 as given, and treats 0 as 'turn it off' (undefined)", () => {
    const pocket = addPocket("Auto-save Target", 1_000_000_00);
    updatePocket(pocket.id, { autoSaveMinor: 50_000_00 });
    expect(getPocket(pocket.id)?.autoSaveMinor).toBe(50_000_00);
    updatePocket(pocket.id, { autoSaveMinor: 0 });
    expect(getPocket(pocket.id)?.autoSaveMinor).toBeUndefined();
  });

  it("clears targetDate when explicitly passed null, and leaves it alone when omitted", () => {
    const pocket = addPocket("Date Target", 1_000_000_00, Date.now() + 1000);
    updatePocket(pocket.id, { name: "still has a date" });
    expect(getPocket(pocket.id)?.targetDate).toBeDefined();
    updatePocket(pocket.id, { targetDate: null });
    expect(getPocket(pocket.id)?.targetDate).toBeUndefined();
  });

  it("returns undefined for an unknown pocket id without throwing", () => {
    expect(updatePocket("does-not-exist", { name: "x" })).toBeUndefined();
  });
});
