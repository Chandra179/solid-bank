import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../../theme/colors";
import { IconChevronLeft } from "../../components/icons";
import NumericKeypad from "../../components/NumericKeypad";
import Button from "../../components/Button";
import { updateUserProfile } from "@/data";
import { useInvalidateData } from "@/data/queries";
import { t } from "@/i18n";

const MAX_DIGITS = 13; // Indonesian mobile numbers run up to ~13 digits after the country code
const MIN_DIGITS = 9;

type Props = NativeStackScreenProps<RootStackParamList, "PhoneEntry">;

function formatPhone(digits: string) {
  // Loose grouping for readability while typing (8123 456 7890), not a
  // strict national-format mask — good enough for a demo, a real one would
  // use a proper libphonenumber-based formatter.
  return digits.replace(/(\d{4})(\d{3})?(\d{0,4})?/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
}

export default function PhoneEntryScreen({ navigation }: Props) {
  const [digits, setDigits] = useState("");
  const isValid = digits.length >= MIN_DIGITS;
  const invalidate = useInvalidateData();

  function appendDigit(d: string) {
    setDigits((prev) => (prev.length >= MAX_DIGITS ? prev : prev + d));
  }
  function backspace() {
    setDigits((prev) => prev.slice(0, -1));
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
        <Text className="text-2xl font-semibold text-slate-900">{t("onboarding.phoneEntry.title")}</Text>
        <Text className="text-body text-slate-500">{t("onboarding.phoneEntry.subtitle")}</Text>
      </View>

      {/* Anchored a fixed distance below the title instead of centered in
          whatever space is left above the keypad — vertical-centering a
          small block of content in a tall flex-1 region reads as a big
          empty screen with the input floating in the middle of it, most
          noticeable on numeric-entry screens like this one where there's
          little else on screen to fill that space. */}
      <View className="items-center px-6 pt-12">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <View className="rounded-lg border border-slate-200 px-3 py-1.5">
            <Text className="text-lg font-semibold text-slate-900">+62</Text>
          </View>
          <Text className="text-2xl font-semibold text-slate-900">
            {digits.length > 0 ? formatPhone(digits) : t("onboarding.phoneEntry.placeholder")}
          </Text>
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-2">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>

      <View className="px-6 pb-4 pt-4">
        <Button
          label={t("common.continue")}
          variant="primary"
          disabled={!isValid}
          onPress={() => {
            // Was validated and then thrown away — Profile kept showing the
            // hardcoded demo phone number no matter what was typed here.
            updateUserProfile({ phone: `+62 ${formatPhone(digits)}` });
            invalidate();
            navigation.navigate("Otp", { phone: `+62${digits}` });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
