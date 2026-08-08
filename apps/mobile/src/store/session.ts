import { create } from "zustand";

interface SessionState {
  userId: string | null;
  isAuthenticated: boolean;
  setUser: (userId: string) => void;
  clear: () => void;
}

// Minimal Zustand store as the starting point for app-wide state
// (session, not server data — use the api client + a data-fetching lib
// like TanStack Query for anything that comes from the backend).
export const useSessionStore = create<SessionState>((set) => ({
  userId: null,
  isAuthenticated: false,
  setUser: (userId) => set({ userId, isAuthenticated: true }),
  clear: () => set({ userId: null, isAuthenticated: false }),
}));
