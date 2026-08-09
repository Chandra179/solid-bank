import { describe, expect, it } from "vitest";
import { getPocketPaceMessage, getPocketPaceStatus } from "./pocketPacing";

const DAY = 24 * 60 * 60 * 1000;

describe("getPocketPaceStatus", () => {
  it("is 'funded' once saved reaches the target, target date or not", () => {
    expect(
      getPocketPaceStatus({ savedMinor: 500_000, targetMinor: 500_000, createdAt: 0 })
    ).toBe("funded");
    expect(
      getPocketPaceStatus({ savedMinor: 600_000, targetMinor: 500_000, createdAt: 0, targetDate: 1000 })
    ).toBe("funded");
  });

  it("is 'no-target' when there's no target date and the goal isn't met", () => {
    expect(
      getPocketPaceStatus({ savedMinor: 100_000, targetMinor: 500_000, createdAt: 0 })
    ).toBe("no-target");
  });

  it("is 'overdue' once now has passed the target date without reaching the goal", () => {
    const now = 10 * DAY;
    expect(
      getPocketPaceStatus(
        { savedMinor: 100_000, targetMinor: 500_000, createdAt: 0, targetDate: 5 * DAY },
        now
      )
    ).toBe("overdue");
  });

  it("is 'on-track' when actual progress is within the grace band of expected progress", () => {
    // Halfway through a 10-day window, 45% saved — within the 10-point
    // grace band of the 50% expected fraction.
    const now = 5 * DAY;
    expect(
      getPocketPaceStatus(
        { savedMinor: 450_000, targetMinor: 1_000_000, createdAt: 0, targetDate: 10 * DAY },
        now
      )
    ).toBe("on-track");
  });

  it("is 'behind' when actual progress falls outside the grace band", () => {
    // Halfway through a 10-day window, only 10% saved.
    const now = 5 * DAY;
    expect(
      getPocketPaceStatus(
        { savedMinor: 100_000, targetMinor: 1_000_000, createdAt: 0, targetDate: 10 * DAY },
        now
      )
    ).toBe("behind");
  });

  it("treats a zero target as 0% progress rather than dividing by zero", () => {
    expect(
      getPocketPaceStatus({ savedMinor: 0, targetMinor: 0, createdAt: 0 })
    ).toBe("no-target");
  });
});

describe("getPocketPaceMessage", () => {
  it("returns null for 'no-target' regardless of a target date label", () => {
    expect(getPocketPaceMessage("no-target", "1 January 2026")).toBeNull();
  });

  it("returns a static message for 'funded' even without a date label", () => {
    expect(getPocketPaceMessage("funded")).toBe("Goal reached!");
  });

  it("returns null for 'on-track'/'behind'/'overdue' when there's no date label to reference", () => {
    expect(getPocketPaceMessage("on-track")).toBeNull();
    expect(getPocketPaceMessage("behind")).toBeNull();
    expect(getPocketPaceMessage("overdue")).toBeNull();
  });

  it("includes the target date label when one is given", () => {
    expect(getPocketPaceMessage("on-track", "1 January 2026")).toContain("1 January 2026");
    expect(getPocketPaceMessage("behind", "1 January 2026")).toContain("1 January 2026");
    expect(getPocketPaceMessage("overdue", "1 January 2026")).toContain("1 January 2026");
  });
});
