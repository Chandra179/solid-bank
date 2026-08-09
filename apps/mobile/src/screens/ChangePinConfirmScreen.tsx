import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft } from "../components/icons";
import NumericKeypad from "../components/NumericKeypad";
import DigitEntry from "../components/DigitEntry";
import { useSessionStore } from "../store/session";

const PIN_LENGTH = 6;

type Props = NativeStackScreenProps<RootStackParamList, "ChangePinConfirm">;

// Step 3 of 3: re-enter the new PIN to catch typos, then actually persist
// it. Unlike onboarding's ConfirmPinScreen (which finishes into
// OnboardingComplete), this navigates back to Security — it's already in
// the stack from Security -> ChangePin -> ChangePinNew -> here, so
// `navigate` pops back to that existing instance and merges the
// `pinJustChanged` param in, rather than pushing a fourth screen.
export default function ChangePinConfirmScreen({ navigation, route }: Props) {
  const { newPin } = route.params;
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

  // See ConfirmPinScreen (onboarding) for why this side effect lives in a
  // useEffect rather than inside the setPin updater above.
  useEffect(() => {
    if (pin.length !== PIN_LENGTH || advancing.current) return;
    advancing.current = true;
    const timer = setTimeout(() => {
      if (pin === newPin) {
        persistPin(newPin);
        navigation.navigate("Security", { pinJustChanged: true });
      } else {
        setError("PINs don't match. Try again.");
        setPin("");
        advancing.current = false;
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [pin, newPin, persistPin, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">Confirm your new PIN</Text>
        <Text className="text-body text-slate-500">Enter it once more to make sure it's right.</Text>
      </View>

      <View className="items-center px-6 pt-12" style={{ gap: 12 }}>
        <DigitEntry length={PIN_LENGTH} value={pin} masked />
        {error ? <Text className="text-body font-medium text-red-600">{error}</Text> : null}
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>
    </SafeAreaView>
  );
}