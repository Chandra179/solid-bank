// Pulled out of ProfileScreen, which used to do `name.slice(0, 2)` — that
// takes the first two *characters* of the string, so a two-word name like
// "Jack Chandra" rendered as "JA" (the first two letters of "Jack") instead
// of the "JC" a user would actually expect from their first and last name.
// Single-word names (or a name that hasn't loaded yet) fall back to the old
// first-two-characters behavior, which is the only sane option when there's
// no second word to take an initial from.
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0] ?? "";
  if (words.length <= 1) return first.slice(0, 2).toUpperCase();
  // tsconfig has noUncheckedIndexedAccess on, so `words[...]` is
  // `string | undefined` even right after the length check above — .charAt
  // (always returns a string, "" if out of range) sidesteps that without
  // needing a redundant narrowing check on every access.
  const last = words[words.length - 1] ?? "";
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}
