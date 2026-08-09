// Lightweight parser/formatter for the plain-text "YYYY-MM-DD" target-date
// fields on CreatePocketScreen/EditPocketScreen. There's no date-picker
// dependency in package.json (nothing beyond safe-area-context/screens/svg
// is installed for UI chrome), so a validated text field is the pragmatic
// stand-in until one gets added — same spirit as AmountEntryScreen's plain
// numeric TextInput standing in for a real currency-input component.
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

// Returns undefined for anything that isn't a real calendar date, not just
// anything that doesn't match the regex shape — catches both malformed
// numbers and JS's own date rollover (e.g. "2026-02-30" silently becoming
// March 2nd instead of erroring), since a date whose components don't match
// what was typed back out isn't the date the user meant.
export function parseDateInput(text: string): number | undefined {
  const match = DATE_RE.exec(text.trim());
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return undefined;
  return date.getTime();
}

export function formatDateInput(epochMs: number): string {
  const d = new Date(epochMs);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
