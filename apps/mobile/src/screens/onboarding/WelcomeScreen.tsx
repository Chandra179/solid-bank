import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../../theme/colors";
import { IconPocket } from "../../components/icons";
import Button from "../../components/Button";
import { useTranslation } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

// Entry point for anyone not yet authenticated. "I already have an
// account" routes to the same PhoneEntry screen as "Get Started" —
// intentional: this is a phone+OTP passwordless flow (the SEA/Indonesian
// convention, per docs/digital_bank_research.md), so signup and login
// share one entry point and the backend branches on whether the phone
// number is already registered. No separate password-based Login screen
// exists or is needed here.
export default function WelcomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-brand-700 px-6" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center" style={{ gap: 16 }}>
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-white/15">
          <IconPocket size={36} color={colors.neutral0} />
        </View>
        <Text className="text-3xl font-bold text-white">{t("welcome.appName")}</Text>
        <Text className="max-w-[260px] text-center text-label text-brand-50">{t("welcome.tagline")}</Text>
      </View>

      <View className="pb-6" style={{ gap: 12 }}>
        <Button label={t("welcome.getStarted")} variant="secondary" onPress={() => navigation.navigate("PhoneEntry")} />
        <Text
          onPress={() => navigation.navigate("PhoneEntry")}
          className="text-center text-body font-semibold text-white"
        >
          {t("welcome.haveAccount")}
        </Text>
      </View>
    </SafeAreaView>
  );
}
