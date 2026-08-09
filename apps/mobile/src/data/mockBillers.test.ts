import { describe, expect, it } from "vitest";
import { lookupMockBillAmount } from "./mockBillers";

describe("lookupMockBillAmount", () => {
  it("is deterministic — the same customer number always returns the same bill amount", () => {
    expect(lookupMockBillAmount("123456789012")).toBe(lookupMockBillAmount("123456789012"));
  });

  it("returns an amount in the documented Rp 100.000–400.000 range", () => {
    const amountMinor = lookupMockBillAmount("987654321098");
    expect(amountMinor).toBeGreaterThanOrEqual(100_000_00);
    expect(amountMinor).toBeLessThan(400_000_00);
  });

  it("returns an integer number of minor units (whole rupiah amounts, no fractional sen)", () => {
    const amountMinor = lookupMockBillAmount("111122223333");
    expect(Number.isInteger(amountMinor)).toBe(true);
    expect(amountMinor % 100).toBe(0);
  });

  it("generally varies by customer number (not a constant lookup)", () => {
    const amounts = new Set([
      lookupMockBillAmount("000000000001"),
      lookupMockBillAmount("000000000002"),
      lookupMockBillAmount("111111111111"),
      lookupMockBillAmount("222222222222"),
    ]);
    expect(amounts.size).toBeGreaterThan(1);
  });
});
