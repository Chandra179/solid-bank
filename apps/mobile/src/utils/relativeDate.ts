// Single source of truth for turning a timestamp into the app's relative
// date/time labels. Previously Home's transactions and PocketDetail's
// history each hardcoded their own label string per mock entry ("Today,
// 09:41" vs "3 days ago") with no shared logic behind either, so the two
// lists read inconsistently for no reason. This is the util that would
// back both once real transaction timestamps exist — mock data now calls
// it too, instead of hand-writing labels.
export function formatRelativeDate(occurredAt: number, now: number = Date.now()): string {
  const date = new Date(occurredAt);
  const time = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const startOfDay = (ms: number) => {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const dayDiff = Math.round((startOfDay(now) - startOfDay(occurredAt)) / (24 * 60 * 60 * 1000));

  if (dayDiff <= 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Yesterday, ${time}`;
  if (dayDiff < 7) return `${dayDiff} days ago`;

  const weeks = Math.floor(dayDiff / 7);
  if (weeks < 5) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;

  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
