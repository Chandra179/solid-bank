import type { UserProfile } from "./types";

// Standing in for a real GET /api/v1/me call once apps/api/internal/auth's
// session endpoint exists. kycStatus is "verified" here because only a
// fully onboarded user can reach the main app at all (see the
// isAuthenticated gate in navigation/RootNavigator.tsx) — the "pending"
// state has its own dedicated screen during onboarding (KycPendingScreen)
// rather than showing up here.
const USER_PROFILE: UserProfile = {
  name: "Jack",
  phone: "+62 812-3456-7890",
  kycStatus: "verified",
};

export function getUserProfile(): UserProfile {
  return USER_PROFILE;
}
