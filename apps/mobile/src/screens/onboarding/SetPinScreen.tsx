import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import NumericKeypad from "../../components/NumericKeypad";
import DigitEntry from "../../components/DigitEntry";

const PIN_LENGTH = 6;

type Props = NativeStackScreenProps<RootStackParamList, "SetPin">;

// This PIN is what ConfirmScreen (apps/mobile/src/screens/ConfirmScreen.tsx)
// will eventually ask for as a step-up check before a transfer/top-up
// actually submits — the re-auth gap flagged earlier. Onboarding is the
// natural place to create it since the user's already deep in a
// numeric-keypad flow.
export default function SetPinScreen({ navigation }: Props) {
  const [pin, setPin] = useState("");
  const advancing = useRef(false);

  function appendDigit(d: string) {
    if (advancing.current) return;
    setPin((prev) => {
      if (prev.length >= PIN_LENGTH) return prev;
      const next = prev + d;
      if (next.length === PIN_LENGTH) {
        advancing.current = true;
        setTimeout(() => navigation.navigate("ConfirmPin", { pin: next }), 250);
      }
      return next;
    });
  }
  function backspace() {
    setPin((prev) => prev.slice(0, -1));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">Create a PIN</Text>
        <Text className="text-[13px] text-slate-500">You'll use this to confirm transfers and top ups.</Text>
      </View>

      {/* See PhoneEntryScreen for why this is top-anchored (fixed pt-12)
          rather than vertically centered in the leftover flex-1 space. */}
      <View className="items-center px-6 pt-12">
        <DigitEntry length={PIN_LENGTH} value={pin} masked />
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>
    </SafeAreaView>
  );
}
