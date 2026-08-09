import { describe, expect, it } from "vitest";
import { adjustAccountBalance, getAccountSummary } from "./mockAccount";

// ACCOUNT_SUMMARY is one shared module-level object — the same thing
// VerifyPinScreen mutates directly on every completed money move — so
// these tests apply their own deltas and assert on the net *change*
// relative to a snapshot taken at the top of each test, rather than
// asserting an absolute balance that would break if another test (or a
// future one) runs its own adjustment first.
describe("adjustAccountBalance", () => {
  it("increases the balance by a positive delta (e.g. a top-up)", () => {
    const before = getAccountSummary().balanceMinor;
    adjustAccountBalance(100_000_00); // Rp 100.000
    expect(getAccountSummary().balanceMinor).toBe(before + 100_000_00);
  });

  it("decreases the balance by a negative delta (e.g. a transfer out)", () => {
    const before = getAccountSummary().balanceMinor;
    adjustAccountBalance(-50_000_00); // Rp 50.000
    expect(getAccountSummary().balanceMinor).toBe(before - 50_000_00);
  });

  it("is not clamped at zero — unlike pockets, an overdraft here isn't caught client-side", () => {
    // Documents existing behavior (see mockAccount.ts's own comment: a
    // real backend is the actual source of truth for insufficient-funds
    // rejection) rather than asserting a safety net that doesn't exist —
    // if this ever starts clamping, that's a deliberate product decision
    // this test should catch and force a second look at.
    const before = getAccountSummary().balanceMinor;
    adjustAccountBalance(-(before + 1_000_000_00));
    expect(getAccountSummary().balanceMinor).toBeLessThan(0);
  });

  it("returns the same object listed by getAccountSummary (mutated in place)", () => {
    const result = adjustAccountBalance(0);
    expect(result).toBe(getAccountSummary());
  });
});
