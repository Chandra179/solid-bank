import { colors } from "@/theme/colors";

// Was flagged in TODO.md: every pocket's progress bar rendered in the same
// green regardless of how close it actually was to its goal or deadline,
// and CreatePocketScreen had no target-date field at all — so "auto-save
// weekly" had nothing to actually pace against. This is that pacing.
export type PocketPaceStatus = "no-target" | "funded" | "on-track" | "behind" | "overdue";

type PaceInput = {
  savedMinor: number;
  targetMinor: number;
  createdAt: number;
  targetDate?: number;
};

// Expected progress is linear interpolation between createdAt (0% expected)
// and targetDate (100% expected) — a simple model (real saving isn't
// linear, paychecks are lumpy) but an honest, legible one: "you're X% of
// the way through the time you gave yourself, and Y% of the way to the
// goal" is a comparison a user can actually reason about.
export function getPocketPaceStatus(pocket: PaceInput, now: number = Date.now()): PocketPaceStatus {
  const actualFraction = pocket.targetMinor > 0 ? pocket.savedMinor / pocket.targetMinor : 0;
  if (actualFraction >= 1) return "funded";
  if (!pocket.targetDate) return "no-target";
  if (now >= pocket.targetDate) return "overdue";

  const totalWindowMs = pocket.targetDate - pocket.createdAt;
  const elapsedMs = now - pocket.createdAt;
  const expectedFraction = totalWindowMs > 0 ? Math.min(1, Math.max(0, elapsedMs / totalWindowMs)) : 1;

  // A 10-point grace band before flagging "behind" — real saving happens in
  // lumps (payday, an auto-save boost), not a smooth daily trickle, so
  // treating any momentary dip under the exact expected line as "behind"
  // would flip the color back and forth on totally normal weeks.
  const GRACE = 0.1;
  return actualFraction >= expectedFraction - GRACE ? "on-track" : "behind";
}

export function pocketPaceColor(status: PocketPaceStatus): string {
  switch (status) {
    case "behind":
      return colors.warning500;
    case "overdue":
      return colors.danger500;
    case "funded":
    case "on-track":
    case "no-target":
    default:
      return colors.success500;
  }
}

// Short status line for PocketDetailScreen, which has room for one;
// PocketCard (Home's horizontal row, Pockets' list) stays color-only —
// a caption-sized card is too cramped for this much text.
export function getPocketPaceMessage(status: PocketPaceStatus, targetDateLabel?: string): string | null {
  switch (status) {
    case "funded":
      return "Goal reached!";
    case "on-track":
      return targetDateLabel ? `On track for ${targetDateLabel}` : null;
    case "behind":
      return targetDateLabel ? `Behind pace — add more to catch up by ${targetDateLabel}` : null;
    case "overdue":
      return targetDateLabel ? `Past your target date of ${targetDateLabel}` : null;
    case "no-target":
    default:
      return null;
  }
}
