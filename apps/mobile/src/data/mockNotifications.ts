import { formatRelativeDate } from "@/utils/relativeDate";

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
    id: "notif_2",
    category: "pocket",
    title: "Bali Trip is 31% funded",
    message: "Keep it up — add a bit more to stay on pace for your goal.",
    occurredAt: NOW - DAY,
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

export function listNotifications(): (Notification & { dateLabel: string })[] {
  return NOTIFICATIONS.map((n) => ({ ...n, dateLabel: formatRelativeDate(n.occurredAt) }));
}

export function getUnreadNotificationCount(): number {
  return NOTIFICATIONS.filter((n) => !n.read).length;
}

// Backs NotificationsScreen marking an item read on tap — mutates in place,
// same pattern as adjustPocketBalance/updatePocket.
export function markNotificationRead(id: string): void {
  const notif = NOTIFICATIONS.find((n) => n.id === id);
  if (notif) notif.read = true;
}
