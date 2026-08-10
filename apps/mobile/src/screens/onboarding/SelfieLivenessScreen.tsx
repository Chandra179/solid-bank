import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../../theme/colors";
import { IconCamera } from "../../components/icons";
import { t } from "../../i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Selfie">;
type Stage = "framing" | "checking";

// Same mock-camera caveat as KtpScanScreen — the oval guide sits over a
// plain dark View, not a real front-camera feed, until a camera library is
// added. The "checking" stage stands in for real liveness detection
// (blink/head-turn prompts, server-side liveness scoring) — kept as a
// short deterministic delay here since there's nothing real to check yet.
export default function SelfieLivenessScreen({ navigation }: Props) {
  const [stage, setStage] = useState<Stage>("framing");

  useEffect(() => {
    if (stage !== "checking") return;
    const t = setTimeout(() => navigation.navigate("KycPending"), 1200);
    return () => clearTimeout(t);
  }, [stage, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-5">
        <Text className="text-center text-lg font-semibold text-slate-900">{t("onboarding.selfie.title")}</Text>
      </View>

      <View className="px-6 pb-2 pt-2">
        <Text className="text-center text-body text-slate-500">
          {stage === "framing" ? t("onboarding.selfie.framingPrompt") : t("onboarding.selfie.checkingPrompt")}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="h-72 w-72 items-center justify-center rounded-full bg-slate-900">
          <View
            className="h-56 w-48 border-2 border-dashed border-white/60"
            style={{ borderRadius: 999 }}
          />
        </View>
      </View>

      <View className="px-6 pb-4 items-center">
        {stage === "framing" ? (
          <Pressable
            onPress={() => setStage("checking")}
            accessibilityLabel={t("onboarding.selfie.takeSelfieLabel")}
            accessibilityRole="button"
            className="h-16 w-16 items-center justify-center rounded-full bg-brand-700"
          >
            <IconCamera size={26} color={colors.neutral0} />
          </Pressable>
        ) : (
          <Text className="text-body font-medium text-slate-500">{t("onboarding.selfie.verifying")}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
