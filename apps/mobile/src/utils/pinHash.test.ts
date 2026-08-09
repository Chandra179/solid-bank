import { describe, expect, it } from "vitest";
import { hashPin } from "./pinHash";

describe("hashPin", () => {
  it("is deterministic — the same PIN always hashes the same way", () => {
    expect(hashPin("111111")).toBe(hashPin("111111"));
  });

  it("produces different hashes for different PINs", () => {
    expect(hashPin("111111")).not.toBe(hashPin("111112"));
  });

  it("does not return the raw PIN", () => {
    expect(hashPin("123456")).not.toBe("123456");
  });

  it("distinguishes PINs that only differ in digit order", () => {
    // A weak hash could collide on anagram-like inputs — this is the
    // specific case worth pinning down given the store now compares
    // hashes instead of raw strings for PIN verification.
    expect(hashPin("123456")).not.toBe(hashPin("654321"));
  });

  it("always returns an 8-character lowercase hex string", () => {
    expect(hashPin("000000")).toMatch(/^[0-9a-f]{8}$/);
    expect(hashPin("999999")).toMatch(/^[0-9a-f]{8}$/);
  });
});
