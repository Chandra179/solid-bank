import React, { useRef, useState } from "react";
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

type Props = NativeStackScreenProps<RootStackParamList, "ChangePin">;

// Step 1 of 3 for a real PIN reset, reached from Security's "Change PIN"
// row. Re-verifies the current PIN before letting anyone set a new one —
// same re-auth principle VerifyPinScreen applies before money moves, just
// without a money-move context to carry through. See navigation/types.ts
// for why this is three dedicated screens rather than reusing onboarding's
// SetPin/ConfirmPin pair directly.
export default function ChangePinScreen({ navigation }: Props) {
  const storedPin = useSessionStore((s) => s.pin);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const advancing = useRef(false);

  function appendDigit(d: string) {
    if (advancing.current) return;
    setError(null);
    setPin((prev) => {
      if (prev.length >= PIN_LENGTH) return prev;
      const next = prev + d;
      if (next.length === PIN_LENGTH) {
        advancing.current = true;
        setTimeout(() => {
          if (next === storedPin) {
            navigation.navigate("ChangePinNew");
          } else {
            setError("Incorrect PIN. Try again.");
            setPin("");
            advancing.current = false;
          }
        }, 250);
      }
      return next;
    });
  }
  function backspace() {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  }

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
        <Text className="text-2xl font-semibold text-slate-900">Confirm your current PIN</Text>
        <Text className="text-body text-slate-500">First, let's make sure it's really you.</Text>
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