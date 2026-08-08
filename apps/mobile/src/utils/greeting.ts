// Small enough that it doesn't need its own directory structure beyond
// this one file — pulled out of HomeScreen so the boundary logic (what
// counts as "morning") lives in one testable place instead of being
// re-derived if another screen ever wants the same greeting.
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
