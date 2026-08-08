import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useSessionStore } from "@/store/session";
import type { RootStackParamList } from "./types";

import HomeScreen from "@/screens/HomeScreen";
import PocketDetailScreen from "@/screens/PocketDetailScreen";
import TransferScreen from "@/screens/TransferScreen";
import TopUpScreen from "@/screens/TopUpScreen";
import AmountEntryScreen from "@/screens/AmountEntryScreen";
import ConfirmScreen from "@/screens/ConfirmScreen";
import VerifyPinScreen from "@/screens/VerifyPinScreen";
import SuccessScreen from "@/screens/SuccessScreen";
import ReceiptScreen from "@/screens/ReceiptScreen";
import TransactionsScreen from "@/screens/TransactionsScreen";
import ErrorScreen from "@/screens/ErrorScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import PocketsScreen from "@/screens/PocketsScreen";
import CreatePocketScreen from "@/screens/CreatePocketScreen";
import CardsScreen from "@/screens/CardsScreen";
import ComingSoonScreen from "@/screens/ComingSoonScreen";

import WelcomeScreen from "@/screens/onboarding/WelcomeScreen";
import PhoneEntryScreen from "@/screens/onboarding/PhoneEntryScreen";
import OtpScreen from "@/screens/onboarding/OtpScreen";
import ProfileSetupScreen from "@/screens/onboarding/ProfileSetupScreen";
import KtpScanScreen from "@/screens/onboarding/KtpScanScreen";
import SelfieLivenessScreen from "@/screens/onboarding/SelfieLivenessScreen";
import KycPendingScreen from "@/screens/onboarding/KycPendingScreen";
import SetPinScreen from "@/screens/onboarding/SetPinScreen";
import ConfirmPinScreen from "@/screens/onboarding/ConfirmPinScreen";
import OnboardingCompleteScreen from "@/screens/onboarding/OnboardingCompleteScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Split out of App.tsx so App.tsx can stay a one-glance entry point
// (providers only) while this file owns the thing that actually grows over
// time: the route table. Two screen groups gated on session state, the
// standard React Navigation "auth flow" pattern — only one group is ever
// mounted, so an onboarding screen can never accidentally be reachable
// once logged in (and vice versa) — there's no shared route table to
// misuse, and the navigator resets to each group's first screen
// automatically when isAuthenticated flips (OnboardingCompleteScreen flips
// it true; ProfileScreen's Log out flips it back to false).
export default function RootNavigator() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  return (
    <NavigationContainer>
      {/* contentStyle here is the default backdrop exposed during a
          slide transition, before the incoming/outgoing screen's own
          background has fully covered it. Without this, whatever the
          navigator's own default background is (which doesn't
          necessarily match either screen) can flash briefly at the
          transition seam — most noticeable going in/out of Welcome,
          since it's the one screen with a colored (brand-700) rather
          than white background. Per-screen `options.contentStyle`
          below overrides this default for screens that need it. */}
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#ffffff" } }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PocketDetail" component={PocketDetailScreen} />
            <Stack.Screen name="Transfer" component={TransferScreen} />
            <Stack.Screen name="TopUp" component={TopUpScreen} />
            <Stack.Screen name="AmountEntry" component={AmountEntryScreen} />
            <Stack.Screen name="Confirm" component={ConfirmScreen} />
            <Stack.Screen name="VerifyPin" component={VerifyPinScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Receipt" component={ReceiptScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
            <Stack.Screen name="MoneyMoveError" component={ErrorScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            {/* Real screens for BottomNav's other two tabs, closing the
                "tab does nothing" gap — Pockets/Cards were already built as
                ComingSoon placeholders (src/screens/PocketsScreen.tsx,
                CardsScreen.tsx) but never wired into the navigator, so
                tapping either tab silently did nothing. */}
            <Stack.Screen name="Pockets" component={PocketsScreen} />
            <Stack.Screen name="CreatePocket" component={CreatePocketScreen} />
            <Stack.Screen name="Cards" component={CardsScreen} />
            <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ contentStyle: { backgroundColor: "#1d4ed8" } }} />
            <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="KtpScan" component={KtpScanScreen} />
            <Stack.Screen name="Selfie" component={SelfieLivenessScreen} />
            <Stack.Screen name="KycPending" component={KycPendingScreen} />
            <Stack.Screen name="SetPin" component={SetPinScreen} />
            <Stack.Screen name="ConfirmPin" component={ConfirmPinScreen} />
            <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
