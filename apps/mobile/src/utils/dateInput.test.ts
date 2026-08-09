import { describe, expect, it } from "vitest";
import { formatDateInput, parseDateInput } from "./dateInput";

describe("parseDateInput", () => {
  it("parses a well-formed YYYY-MM-DD date", () => {
    const parsed = parseDateInput("2026-12-25");
    expect(parsed).toBeDefined();
    expect(new Date(parsed!).getFullYear()).toBe(2026);
    expect(new Date(parsed!).getMonth()).toBe(11); // 0-indexed
    expect(new Date(parsed!).getDate()).toBe(25);
  });

  it("rejects a date that JS would silently roll over (Feb 30)", () => {
    // new Date(2026, 1, 30) rolls over to March 2 — parseDateInput has to
    // catch that instead of returning a date the user didn't type.
    expect(parseDateInput("2026-02-30")).toBeUndefined();
  });

  it("rejects malformed input", () => {
    expect(parseDateInput("not a date")).toBeUndefined();
    expect(parseDateInput("2026/12/25")).toBeUndefined();
    expect(parseDateInput("")).toBeUndefined();
  });

  it("tolerates surrounding whitespace", () => {
    expect(parseDateInput("  2026-01-01  ")).toBeDefined();
  });
});

describe("formatDateInput", () => {
  it("round-trips through parseDateInput", () => {
    const original = "2026-03-07";
    const parsed = parseDateInput(original);
    expect(parsed).toBeDefined();
    expect(formatDateInput(parsed!)).toBe(original);
  });

  it("zero-pads single-digit month and day", () => {
    const epoch = new Date(2026, 0, 5).getTime(); // Jan 5
    expect(formatDateInput(epoch)).toBe("2026-01-05");
  });
});
