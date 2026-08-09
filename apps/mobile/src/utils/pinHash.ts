// Turns a raw PIN into a fixed-length, non-reversible-looking string so
// store/session.ts never has to hold the actual digits in memory.
//
// This is still NOT a real credential hash — a real implementation would
// never do PIN verification client-side at all (see store/session.ts's own
// comment: the server should be the one comparing a salted hash, the same
// way apps/api/internal/auth treats every other credential). FNV-1a here is
// a fast, synchronous, dependency-free way to stop "read the PIN straight
// out of a JS debugger or React DevTools" from being trivial, which is the
// specific gap this was asked to close — it does not add resistance to
// brute-forcing a 6-digit space (only 1,000,000 possibilities exist
// regardless of hash strength) or protect against anyone with code-execution
// access to this device. Swap this for real server-side verification before
// this app holds real money.
export function hashPin(pin: string): string {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < pin.length; i++) {
    hash ^= pin.charCodeAt(i);
    // FNV prime multiplication, done with shifts/adds so it stays within
    // 32-bit int math in every JS engine (RN's Hermes included).
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
