import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

import NumericKeypad from "../../components/NumericKeypad";
import DigitEntry from "../../components/DigitEntry";
import { useSessionStore } from "../../store/session";

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
    setPin((prev) => {
      if (prev.length >= PIN_LENGTH) return prev;
      const next = prev + d;
      if (next.length === PIN_LENGTH) {
        advancing.current = true;
        setTimeout(() => {
          if (next === originalPin) {
            // This is the only place the PIN actually gets persisted —
            // see the caveat in store/session.ts about why this is a demo
            // simplification, not a real security pattern.
            persistPin(originalPin);
            navigation.navigate("OnboardingComplete");
          } else {
            setError("PINs don't match. Try again.");
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
      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">Confirm your PIN</Text>
        <Text className="text-[13px] text-slate-500">Enter it once more to make sure it's right.</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6" style={{ gap: 12 }}>
        <DigitEntry length={PIN_LENGTH} value={pin} masked />
        {error ? <Text className="text-[13px] font-medium text-red-600">{error}</Text> : null}
      </View>

      <View className="px-6 pb-4">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>
    </SafeAreaView>
  );
}
