import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../../theme/colors";
import { IconChevronLeft } from "../../components/icons";
import NumericKeypad from "../../components/NumericKeypad";
import DigitEntry from "../../components/DigitEntry";
import { t } from "../../i18n";

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
            setError(t("onboarding.otp.wrongCode"));
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
          accessibilityLabel={t("common.goBack")}
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">{t("onboarding.otp.title")}</Text>
        <Text className="text-body text-slate-500">{t("onboarding.otp.subtitle", { phone })}</Text>
      </View>

      {/* See PhoneEntryScreen for why this is top-anchored (fixed pt-12)
          rather than vertically centered in the leftover flex-1 space. */}
      <View className="items-center px-6 pt-12" style={{ gap: 12 }}>
        <DigitEntry length={CODE_LENGTH} value={code} />
        {error ? <Text className="text-body font-medium text-red-600" accessibilityLiveRegion="assertive">{error}</Text> : null}
        <Pressable disabled={secondsLeft > 0} onPress={() => setSecondsLeft(RESEND_SECONDS)}>
          <Text className={`text-body font-semibold ${secondsLeft > 0 ? "text-slate-400" : "text-brand-700"}`}>
            {secondsLeft > 0
              ? t("onboarding.otp.resendIn", { seconds: String(secondsLeft).padStart(2, "0") })
              : t("onboarding.otp.resend")}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>
    </SafeAreaView>
  );
}
