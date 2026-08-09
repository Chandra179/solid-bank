import { describe, expect, it } from "vitest";
import { getQrisFeeMinor } from "./fees";

describe("getQrisFeeMinor", () => {
  // QRIS_PROMO_ACTIVE is currently hardcoded true (see fees.ts's own
  // comment on why — no real campaign/calendar system exists yet), so the
  // only behavior there is to actually verify today is "the promo waives
  // the fee entirely." If that flag ever flips, this test is the one that
  // should force a look at the file, not silently start asserting the old
  // value.
  it("is waived while the zero-fee QRIS promo is active", () => {
    expect(getQrisFeeMinor()).toBe(0);
  });

  it("returns a non-negative integer minor-unit amount", () => {
    const fee = getQrisFeeMinor();
    expect(Number.isInteger(fee)).toBe(true);
    expect(fee).toBeGreaterThanOrEqual(0);
  });
});
