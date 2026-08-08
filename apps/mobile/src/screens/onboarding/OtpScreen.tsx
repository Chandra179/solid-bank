import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

import { colors } from "../../theme/colors";
import { IconChevronLeft } from "../../components/icons";
import NumericKeypad from "../../components/NumericKeypad";
import DigitEntry from "../../components/DigitEntry";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

type Props = NativeStackScreenProps<RootStackParamList, "Otp">;

export default function OtpScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const advancing = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  function appendDigit(d: string) {
    if (advancing.current) return;
    setError(null);
    setCode((prev) => {
      if (prev.length >= CODE_LENGTH) return prev;
      const next = prev + d;
      if (next.length === CODE_LENGTH) {
        advancing.current = true;
        // DEMO HOOK: no real SMS provider yet — "000000" simulates an
        // incorrect code so the error state is actually reachable; any
        // other 6 digits simulates success.
        setTimeout(() => {
          if (next === "000000") {
            setError("That code isn't right. Check your messages and try again.");
            setCode("");
            advancing.current = false;
          } else {
            navigation.navigate("ProfileSetup");
          }
        }, 350);
      }
      return next;
    });
  }
  function backspace() {
    setError(null);
    setCode((prev) => prev.slice(0, -1));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">Enter the code</Text>
        <Text className="text-[13px] text-slate-500">We sent a 6-digit code to {phone}</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6" style={{ gap: 12 }}>
        <DigitEntry length={CODE_LENGTH} value={code} />
        {error ? <Text className="text-[13px] font-medium text-red-600">{error}</Text> : null}
        <Pressable disabled={secondsLeft > 0} onPress={() => setSecondsLeft(RESEND_SECONDS)}>
          <Text className={`text-[13px] font-semibold ${secondsLeft > 0 ? "text-slate-400" : "text-brand-700"}`}>
            {secondsLeft > 0 ? `Resend code in 00:${String(secondsLeft).padStart(2, "0")}` : "Resend code"}
          </Text>
        </Pressable>
      </View>

      <View className="px-6 pb-4">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>
    </SafeAreaView>
  );
}
