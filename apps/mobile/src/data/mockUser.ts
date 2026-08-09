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

// Called once onboarding actually collects this data — PhoneEntryScreen for
// phone, ProfileSetupScreen for name. Before this existed, both screens took
// the input, validated it, and then just discarded it: Continue navigated
// on without ever writing it anywhere, so Profile always showed the
// hardcoded "Jack" / demo phone number no matter what a user actually typed
// during onboarding. Partial so either screen can update just its own
// field without needing to know what (if anything) the other has set yet.
export function updateUserProfile(patch: Partial<Pick<UserProfile, "name" | "phone">>): void {
  Object.assign(USER_PROFILE, patch);
}
