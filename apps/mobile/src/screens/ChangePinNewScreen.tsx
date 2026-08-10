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
import { t } from "@/i18n";

const PIN_LENGTH = 6;

type Props = NativeStackScreenProps<RootStackParamList, "ChangePinNew">;

// Step 2 of 3: pick a new PIN, having already proven it's really the user
// on ChangePinScreen. Blocks re-choosing the current PIN — cheap to check
// here (both values are in local/session state already) and a real
// security improvement over onboarding's SetPinScreen, which has no prior
// PIN to compare against.
export default function ChangePinNewScreen({ navigation }: Props) {
  const verifyPin = useSessionStore((s) => s.verifyPin);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const advancing = useRef(false);

  function appendDigit(d: string) {
    if (advancing.current) return;
    setError(null);
    setPin((prev) => (prev.length >= PIN_LENGTH ? prev : prev + d));
  }
  function backspace() {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  }

  // See onboarding's ConfirmPinScreen for why this side effect lives in a
  // useEffect rather than inside the setPin updater above.
  useEffect(() => {
    if (pin.length !== PIN_LENGTH || advancing.current) return;
    advancing.current = true;
    const timer = setTimeout(() => {
      if (verifyPin(pin)) {
        setError(t("changePinNew.sameAsCurrent"));
        setPin("");
        advancing.current = false;
        return;
      }
      navigation.navigate("ChangePinConfirm", { newPin: pin });
    }, 250);
    return () => clearTimeout(timer);
  }, [pin, verifyPin, navigation]);

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
        <Text className="text-2xl font-semibold text-slate-900">{t("changePinNew.title")}</Text>
        <Text className="text-body text-slate-500">{t("changePinNew.subtitle")}</Text>
      </View>

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