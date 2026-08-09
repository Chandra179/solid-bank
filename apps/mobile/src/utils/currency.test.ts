import { describe, expect, it } from "vitest";
import { formatIDR, formatSignedIDR } from "./currency";

describe("formatIDR", () => {
  it("converts minor units (sen) to whole rupiah with id-ID grouping", () => {
    expect(formatIDR(824_050_000)).toBe("Rp 8.240.500");
  });

  it("rounds rather than truncates a fractional minor-unit amount", () => {
    // 150 minor units = Rp 1.5 — shouldn't happen with real integer sen,
    // but formatIDR shouldn't silently floor if it ever does.
    expect(formatIDR(150)).toBe("Rp 2");
  });

  it("formats zero without a stray sign", () => {
    expect(formatIDR(0)).toBe("Rp 0");
  });

  it("formats a negative amount with a leading minus, not parentheses", () => {
    expect(formatIDR(-500_000)).toBe("Rp -5.000");
  });
});

describe("formatSignedIDR", () => {
  it("prefixes a positive amount with +", () => {
    expect(formatSignedIDR(650_000_000)).toBe("+Rp 6.500.000");
  });

  it("prefixes a negative amount with - and drops the double negative", () => {
    expect(formatSignedIDR(-320_000)).toBe("-Rp 3.200");
  });

  it("treats zero as positive (+Rp 0), matching an incoming-money default", () => {
    expect(formatSignedIDR(0)).toBe("+Rp 0");
  });
});
