import { colors } from "@/theme/colors";
import { t } from "@/i18n";

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

// Fill color — used on the progress-bar track itself, which only needs
// WCAG's 3:1 non-text contrast threshold (1.4.11), not 4.5:1. Don't reuse
// this for text; see pocketPaceTextColor below for that.
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

// Text-safe variant of pocketPaceColor — warning500/success500 fail 4.5:1
// as text on white (a WCAG audit flagged this), so pocketPaceShortLabel's
// caption below uses these -600 shades instead of the fill color, even
// though both fill and caption represent "the same" status color.
export function pocketPaceTextColor(status: PocketPaceStatus): string {
  switch (status) {
    case "behind":
      return colors.warning600;
    case "overdue":
      return colors.danger500; // already passes 4.5:1 on white — no -600 needed
    case "funded":
    case "on-track":
    case "no-target":
    default:
      return colors.success600;
  }
}

// Short status line for PocketDetailScreen, which has room for one;
// PocketCard (Home's horizontal row, Pockets' list) stays color-only —
// a caption-sized card is too cramped for this much text.
export function getPocketPaceMessage(status: PocketPaceStatus, targetDateLabel?: string): string | null {
  switch (status) {
    case "funded":
      return t("pocketPace.goalReached");
    case "on-track":
      return targetDateLabel ? t("pocketPace.onTrackFor", { date: targetDateLabel }) : null;
    case "behind":
      return targetDateLabel ? t("pocketPace.behindPace", { date: targetDateLabel }) : null;
    case "overdue":
      return targetDateLabel ? t("pocketPace.pastTarget", { date: targetDateLabel }) : null;
    case "no-target":
    default:
      return null;
  }
}

// One- or two-word caption for PocketCard (Home's horizontal row, Pockets'
// list) — those cards are too cramped for getPocketPaceMessage's full
// sentence, but a WCAG audit correctly flagged that a color-only progress
// bar with no text at all fails 1.4.1 (color can't be the only way pace
// state is conveyed). This is the compact middle ground: short enough for
// a card caption, present often enough that a colorblind user isn't
// relying on hue alone. Returns null for "no-target"/"funded" — a pocket
// with nothing to be behind on, or one that's already done, doesn't need a
// pace caption at all (the existing "saved of target" line already covers
// that case).
export function pocketPaceShortLabel(status: PocketPaceStatus): string | null {
  switch (status) {
    case "on-track":
      return t("pocketPace.short.onTrack");
    case "behind":
      return t("pocketPace.short.behind");
    case "overdue":
      return t("pocketPace.short.overdue");
    case "funded":
    case "no-target":
    default:
      return null;
  }
}
