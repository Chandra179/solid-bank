import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/theme/global.css"; // NativeWind picks up Tailwind classes via this

import { useSessionStore } from "./src/store/session";

import HomeScreen from "./src/screens/HomeScreen";
import PocketDetailScreen from "./src/screens/PocketDetailScreen";
import TransferScreen from "./src/screens/TransferScreen";
import TopUpScreen from "./src/screens/TopUpScreen";
import AmountEntryScreen from "./src/screens/AmountEntryScreen";
import ConfirmScreen from "./src/screens/ConfirmScreen";
import VerifyPinScreen from "./src/screens/VerifyPinScreen";
import SuccessScreen from "./src/screens/SuccessScreen";
import ErrorScreen from "./src/screens/ErrorScreen";

import WelcomeScreen from "./src/screens/onboarding/WelcomeScreen";
import PhoneEntryScreen from "./src/screens/onboarding/PhoneEntryScreen";
import OtpScreen from "./src/screens/onboarding/OtpScreen";
import ProfileSetupScreen from "./src/screens/onboarding/ProfileSetupScreen";
import KtpScanScreen from "./src/screens/onboarding/KtpScanScreen";
import SelfieLivenessScreen from "./src/screens/onboarding/SelfieLivenessScreen";
import KycPendingScreen from "./src/screens/onboarding/KycPendingScreen";
import SetPinScreen from "./src/screens/onboarding/SetPinScreen";
import ConfirmPinScreen from "./src/screens/onboarding/ConfirmPinScreen";
import OnboardingCompleteScreen from "./src/screens/onboarding/OnboardingCompleteScreen";

export type MoneyFlow = "transfer" | "topup";

// Shared params for the AmountEntry -> Confirm -> Success chain. Both the
// Transfer and Top Up entry points feed into this same three-screen tail,
// distinguished only by `flow` (see docs on why: shared amount/confirm/
// success UI, distinct destination/source pickers).
type MoneyMoveContext = {
  flow: MoneyFlow;
  contextId?: string;
  contextLabel: string;
  contextSubLabel?: string;
};

export type RootStackParamList = {
  // Main app (isAuthenticated === true)
  Home: undefined;
  PocketDetail: { pocketId: string };
  Transfer: undefined;
  TopUp: undefined;
  AmountEntry: MoneyMoveContext;
  Confirm: MoneyMoveContext & { amountMinor: number };
  VerifyPin: MoneyMoveContext & { amountMinor: number };
  Success: { flow: MoneyFlow; contextLabel: string; amountMinor: number };
  MoneyMoveError: { reason: string };

  // Onboarding (isAuthenticated === false)
  Welcome: undefined;
  PhoneEntry: undefined;
  Otp: { phone: string };
  ProfileSetup: undefined;
  KtpScan: undefined;
  Selfie: undefined;
  KycPending: undefined;
  SetPin: undefined;
  ConfirmPin: { pin: string };
  OnboardingComplete: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Split into two screen groups gated on session state, the standard React
// Navigation "auth flow" pattern: only one group is ever mounted, so an
// onboarding screen can never accidentally be reachable once logged in
// (and vice versa) — there's no shared route table to misuse, and the
// navigator resets to each group's first screen automatically when
// isAuthenticated flips (see OnboardingCompleteScreen, the only place that
// currently flips it).
export default function App() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  return (
    <SafeAreaProvider>
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
              <Stack.Screen name="MoneyMoveError" component={ErrorScreen} />
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
    </SafeAreaProvider>
  );
}
