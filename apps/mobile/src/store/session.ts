import { create } from "zustand";
import { hashPin } from "@/utils/pinHash";

interface SessionState {
  userId: string | null;
  isAuthenticated: boolean;
  // Holds hashPin(rawPin), never the raw PIN itself — see utils/pinHash.ts
  // for exactly what this does and doesn't protect against. Renamed from
  // `pin` to `pinHash` so nothing can accidentally read this expecting raw
  // digits; every call site goes through setPin()/verifyPin() below instead
  // of touching this field directly.
  //
  // Still a DEMO SIMPLIFICATION overall: a real app verifies a PIN
  // server-side (matching how apps/api/internal/auth treats every other
  // credential) or backs it with the device's secure enclave via biometrics,
  // never a client-side hash compare — that only stops "read it straight out
  // of a JS debugger," not a real attack on the credential itself. Good
  // enough to make VerifyPinScreen's flow demoable end-to-end; not something
  // to carry into a real build.
  pinHash: string | null;
  setUser: (userId: string) => void;
  setPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  clear: () => void;
}

// Minimal Zustand store as the starting point for app-wide state
// (session, not server data — use the api client + a data-fetching lib
// like TanStack Query for anything that comes from the backend).
export const useSessionStore = create<SessionState>((set, get) => ({
  userId: null,
  isAuthenticated: false,
  pinHash: null,
  setUser: (userId) => set({ userId, isAuthenticated: true }),
  setPin: (pin) => set({ pinHash: hashPin(pin) }),
  // Every screen that used to compare `enteredPin === storedPin` directly
  // now calls this instead, so raw-PIN comparison logic lives in exactly
  // one place rather than being copy-pasted across VerifyPinScreen and
  // ChangePinScreen.
  verifyPin: (pin) => get().pinHash !== null && hashPin(pin) === get().pinHash,
  clear: () => set({ userId: null, isAuthenticated: false, pinHash: null }),
}));
