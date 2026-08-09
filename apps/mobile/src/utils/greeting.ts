import { t } from "@/i18n";

// Small enough that it doesn't need its own directory structure beyond
// this one file — pulled out of HomeScreen so the boundary logic (what
// counts as "morning") lives in one testable place instead of being
// re-derived if another screen ever wants the same greeting. Routes through
// i18n's t() (id.ts's greeting.* keys) instead of a hardcoded English
// string now that the app defaults to Bahasa Indonesia — the hour-boundary
// logic here is unaffected by locale, only the returned label is.
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return t("greeting.night");
  if (hour < 12) return t("greeting.morning");
  if (hour < 18) return t("greeting.afternoon");
  return t("greeting.evening");
}
