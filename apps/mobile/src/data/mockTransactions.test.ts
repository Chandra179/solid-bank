import { describe, expect, it } from "vitest";
import {
  getCategoryBreakdown,
  listPocketTransactions,
  listRecentTransactions,
  recordPocketTransaction,
  recordTransaction,
} from "./mockTransactions";

describe("recordTransaction", () => {
  it("prepends to the main list so the newest move shows up first", () => {
    recordTransaction("Test top up", 100_000_00);
    expect(listRecentTransactions()[0]?.name).toBe("Test top up");
  });

  it("carries the exact signed amount through, positive or negative", () => {
    recordTransaction("Test spend", -25_000_00, "Food & Drink");
    const entry = listRecentTransactions().find((tx) => tx.name === "Test spend");
    expect(entry?.amountMinor).toBe(-25_000_00);
  });

  it("assigns a dateLabel derived from the recorded time, not a hardcoded string", () => {
    recordTransaction("Test labeled", -1_000_00);
    const entry = listRecentTransactions().find((tx) => tx.name === "Test labeled");
    // Recorded "now" — formatRelativeDate's "Today, HH:MM" branch.
    expect(entry?.dateLabel).toMatch(/^Today, /);
  });
});

describe("recordPocketTransaction", () => {
  it("scopes history to the given pocket id, not the global list", () => {
    recordPocketTransaction("pocket_1", "Test boost", 50_000_00);
    expect(listPocketTransactions("pocket_1")[0]?.name).toBe("Test boost");
    expect(listPocketTransactions("pocket_3").some((tx) => tx.name === "Test boost")).toBe(false);
  });

  it("creates the pocket's history list on first write if it doesn't exist yet", () => {
    recordPocketTransaction("pocket_test_new", "First entry", 10_000_00);
    expect(listPocketTransactions("pocket_test_new")).toHaveLength(1);
  });
});

describe("listPocketTransactions", () => {
  it("returns an array (not undefined) for a pocket with no history", () => {
    expect(Array.isArray(listPocketTransactions("pocket_2"))).toBe(true);
  });

  it("returns an empty array for an id that was never seeded", () => {
    expect(listPocketTransactions("totally-unknown-pocket")).toEqual([]);
  });
});

describe("getCategoryBreakdown", () => {
  it("only counts outgoing (negative) amounts as spending", () => {
    const breakdown = getCategoryBreakdown(30);
    const incomeCategory = breakdown.find((c) => c.category === "Income");
    expect(incomeCategory).toBeUndefined();
  });

  it("excludes 'Savings' — moving money to a pocket isn't spending it", () => {
    const breakdown = getCategoryBreakdown(30);
    expect(breakdown.find((c) => c.category === "Savings")).toBeUndefined();
  });

  it("sorts categories by total spend, descending", () => {
    const breakdown = getCategoryBreakdown(30);
    for (let i = 1; i < breakdown.length; i++) {
      expect(breakdown[i - 1]!.totalMinor).toBeGreaterThanOrEqual(breakdown[i]!.totalMinor);
    }
  });

  it("returns an empty array for a window with no matching activity", () => {
    // A negative periodDays pushes the window's start into the future,
    // so nothing recorded up to "now" (including entries the tests above
    // just added) can fall inside it — a reliable way to force the
    // "nothing in range" branch regardless of what other tests in this
    // file have already recorded.
    expect(getCategoryBreakdown(-1)).toEqual([]);
  });
});
