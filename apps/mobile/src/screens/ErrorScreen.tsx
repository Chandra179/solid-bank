import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconAlert } from "../components/icons";
import Button from "../components/Button";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "MoneyMoveError">;

// Mirrors SuccessScreen's structure deliberately (icon-in-circle, headline,
// message, primary action) so success and failure read as two outcomes of
// the same design system rather than one polished path and one bolted-on
// afterthought. "Try Again" returns to Confirm (not the picker or amount
// entry) — the user already did the hard part of choosing a recipient/
// amount; a failed submission shouldn't make them redo it.
export default function ErrorScreen({ navigation, route }: Props) {
  const { reason } = route.params;

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-6" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center" style={{ gap: 16 }}>
        <View className="h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <IconAlert size={28} color={colors.danger500} />
        </View>
        <Text className="text-xl font-semibold text-slate-900">{t("errorScreen.title")}</Text>
        <Text className="max-w-[280px] text-center text-body text-slate-500">{reason}</Text>
        <Text className="text-caption text-slate-500">{t("errorScreen.noMoneyLeft")}</Text>
      </View>

      <View className="w-full pb-4" style={{ gap: 12 }}>
        <Button label={t("errorScreen.tryAgain")} variant="primary" onPress={() => navigation.goBack()} />
        <Pressable onPress={() => navigation.popToTop()} className="items-center py-2">
          <Text className="text-body font-semibold text-slate-500">{t("common.cancel")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
