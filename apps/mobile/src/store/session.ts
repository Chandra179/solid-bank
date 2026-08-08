import { create } from "zustand";

interface SessionState {
  userId: string | null;
  isAuthenticated: boolean;
  // DEMO SIMPLIFICATION: storing the raw PIN in plain in-memory JS state is
  // NOT how a real implementation should work — a real app would never
  // hold a PIN in plaintext client state at all. It'd either verify it
  // server-side (hash comparison, matching how apps/api/internal/auth
  // treats credentials as the IdP's responsibility, not this app's) or
  // back it with the device's secure enclave (Keychain/Keystore) via
  // biometrics, never as a plain string a JS debugger could read. Good
  // enough to make VerifyPinScreen's flow demoable end-to-end; not
  // something to carry into a real build.
  pin: string | null;
  setUser: (userId: string) => void;
  setPin: (pin: string) => void;
  clear: () => void;
}

// Minimal Zustand store as the starting point for app-wide state
// (session, not server data — use the api client + a data-fetching lib
// like TanStack Query for anything that comes from the backend).
export const useSessionStore = create<SessionState>((set) => ({
  userId: null,
  isAuthenticated: false,
  pin: null,
  setUser: (userId) => set({ userId, isAuthenticated: true }),
  setPin: (pin) => set({ pin }),
  clear: () => set({ userId: null, isAuthenticated: false, pin: null }),
}));
