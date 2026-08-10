import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import NumericKeypad from "../../components/NumericKeypad";
import DigitEntry from "../../components/DigitEntry";
import { useSessionStore } from "../../store/session";
import { t } from "../../i18n";

const PIN_LENGTH = 6;

type Props = NativeStackScreenProps<RootStackParamList, "ConfirmPin">;

export default function ConfirmPinScreen({ navigation, route }: Props) {
  const { pin: originalPin } = route.params;
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const advancing = useRef(false);
  const persistPin = useSessionStore((s) => s.setPin);

  function appendDigit(d: string) {
    if (advancing.current) return;
    setError(null);
    setPin((prev) => (prev.length >= PIN_LENGTH ? prev : prev + d));
  }
  function backspace() {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  }

  // Side effect kept out of the setPin updater above — updater functions
  // must stay pure, and calling navigate()/persistPin() from inside one can
  // fire twice if the updater ever gets invoked more than once for the same
  // transition, which showed up as the confirm screen visibly double-firing
  // its transition into OnboardingComplete.
  useEffect(() => {
    if (pin.length !== PIN_LENGTH || advancing.current) return;
    advancing.current = true;
    const timer = setTimeout(() => {
      if (pin === originalPin) {
        // This is the only place the PIN actually gets persisted — see the
        // caveat in store/session.ts about why this is a demo simplification,
        // not a real security pattern.
        persistPin(originalPin);
        navigation.navigate("OnboardingComplete");
      } else {
        setError(t("onboarding.confirmPin.mismatch"));
        setPin("");
        advancing.current = false;
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [pin, originalPin, persistPin, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">{t("onboarding.confirmPin.title")}</Text>
        <Text className="text-body text-slate-500">{t("onboarding.confirmPin.subtitle")}</Text>
      </View>

      {/* See PhoneEntryScreen for why this is top-anchored (fixed pt-12)
          rather than vertically centered in the leftover flex-1 space. */}
      <View className="items-center px-6 pt-12" style={{ gap: 12 }}>
        <DigitEntry length={PIN_LENGTH} value={pin} masked />
        {error ? <Text className="text-body font-medium text-red-600" accessibilityLiveRegion="assertive">{error}</Text> : null}
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>
    </SafeAreaView>
  );
}
