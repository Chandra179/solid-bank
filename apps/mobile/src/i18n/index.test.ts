import { describe, expect, it, beforeEach } from "vitest";
import { t, useLocaleStore } from "./index";

describe("t", () => {
  beforeEach(() => {
    useLocaleStore.setState({ locale: "id" });
  });

  it("defaults to Bahasa Indonesia", () => {
    expect(useLocaleStore.getState().locale).toBe("id");
    expect(t("welcome.getStarted")).toBe("Mulai");
  });

  it("resolves a nested dot-path key", () => {
    expect(t("moneyMove.flow.transfer.successTitle")).toBe("Transfer berhasil");
  });

  it("switches locale reactively via the store", () => {
    useLocaleStore.getState().setLocale("en");
    expect(t("welcome.getStarted")).toBe("Get Started");
  });

  it("interpolates {{token}} placeholders", () => {
    expect(t("moneyMove.verifyPinSubtitle", { flowNoun: "transfer" })).toBe(
      "Konfirmasi bahwa ini kamu sebelum transfer ini diproses."
    );
  });

  it("leaves an unmatched placeholder token untouched", () => {
    expect(t("moneyMove.verifyPinSubtitle")).toContain("{{flowNoun}}");
  });

  it("falls back to English, then the raw key, for a locale gap", () => {
    // Every real key exists in both locales (en.ts's `satisfies
    // TranslationShape` enforces that at compile time) — this exercises the
    // resolve() fallback chain itself using a path that exists in neither,
    // cast past the literal-key type since the whole point is simulating a
    // key that isn't in the shape.
    expect(t("this.key.does.not.exist" as never)).toBe("this.key.does.not.exist");
  });
});
