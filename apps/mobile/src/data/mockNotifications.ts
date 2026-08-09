import { formatRelativeDate } from "@/utils/relativeDate";
import { listPockets } from "./mockPockets";
import { getPocketPaceStatus } from "@/utils/pocketPacing";

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const NOW = Date.now();

export type NotificationCategory = "transaction" | "security" | "promo" | "pocket";

export type Notification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  occurredAt: number;
  read: boolean;
};

// Same "captured once, not regenerated per-call" shape as mockTransactions —
// these are mock timestamps, not something that should drift every render.
// The pocket-progress notification that used to live here as a hand-written
// example ("Bali Trip is 31% funded") is generated instead — see
// generatePocketNotifications below.
const NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    category: "transaction",
    title: "Salary received",
    message: "Rp 6.500.000 from Acme Co. landed in your main balance.",
    occurredAt: NOW - DAY - 4 * HOUR,
    read: false,
  },
  {
    id: "notif_3",
    category: "security",
    title: "New sign-in detected",
    message: "Your account was accessed from a new device. Wasn't you? Review it in Security.",
    occurredAt: NOW - 3 * DAY,
    read: true,
  },
  {
    id: "notif_4",
    category: "promo",
    title: "Zero-fee QRIS all week",
    message: "Scan-to-pay with no transaction fee through Sunday.",
    occurredAt: NOW - 5 * DAY,
    read: true,
  },
];

// Read-state for generated notifications can't live on the notification
// object itself (generatePocketNotifications rebuilds that object fresh on
// every call, from the pocket's live state) — so it's tracked separately by
// id, same "mutate a module-level store" pattern as everything else in this
// mock layer, just keyed differently since there's no long-lived object to
// mutate a `read` field on directly.
const READ_POCKET_NOTIF_IDS = new Set<string>();

// Replaces the old hand-written "Bali Trip is 31% funded" mock entry with
// one generated from each pocket's actual pace state (utils/pocketPacing.ts)
// — a pocket that's funded or has no target date generates nothing (there's
// no "31%" to report and nothing to be behind on), matching how
// PocketCard/PocketDetailScreen already treat those two states as
// non-evaluative.
function generatePocketNotifications(): Notification[] {
  return listPockets()
    .map((pocket) => {
      const status = getPocketPaceStatus(pocket);
      if (status === "funded" || status === "no-target") return null;
      const pct = pocket.targetMinor > 0 ? Math.round((pocket.savedMinor / pocket.targetMinor) * 100) : 0;
      const dateLabel = pocket.targetDate
        ? new Date(pocket.targetDate).toLocaleDateString("id-ID", { day: "numeric", month: "long" })
        : undefined;
      const message =
        status === "overdue"
          ? `Past its target date and still ${pct}% funded — update the goal or add funds.`
          : status === "behind"
            ? `Behind pace — add more to catch up${dateLabel ? ` by ${dateLabel}` : ""}.`
            : `Right on pace — keep it up to hit your goal${dateLabel ? ` by ${dateLabel}` : ""}.`;
      const id = `pocket_notif_${pocket.id}`;
      return {
        id,
        category: "pocket" as const,
        title: `${pocket.name} is ${pct}% funded`,
        message,
        // Fixed relative offset rather than Date.now() — a generated
        // notification shouldn't visually jump to "just now" just because
        // NotificationsScreen happened to re-render.
        occurredAt: NOW - DAY,
        read: READ_POCKET_NOTIF_IDS.has(id),
      };
    })
    .filter((n): n is Notification => n !== null);
}

export function listNotifications(): (Notification & { dateLabel: string })[] {
  const all = [...NOTIFICATIONS, ...generatePocketNotifications()].sort((a, b) => b.occurredAt - a.occurredAt);
  return all.map((n) => ({ ...n, dateLabel: formatRelativeDate(n.occurredAt) }));
}

export function getUnreadNotificationCount(): number {
  return listNotifications().filter((n) => !n.read).length;
}

// Backs NotificationsScreen marking an item read on tap. Static
// notifications mutate in place (same pattern as adjustPocketBalance/
// updatePocket); generated pocket notifications instead record their id in
// READ_POCKET_NOTIF_IDS, since there's no persistent object for them to
// mutate a `read` field on between calls.
export function markNotificationRead(id: string): void {
  if (id.startsWith("pocket_notif_")) {
    READ_POCKET_NOTIF_IDS.add(id);
    return;
  }
  const notif = NOTIFICATIONS.find((n) => n.id === id);
  if (notif) notif.read = true;
}
