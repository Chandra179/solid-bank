import React, { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCheck, IconChevronLeft, IconShield } from "../components/icons";
import SelectRow from "../components/SelectRow";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Security">;

// Real destination behind Profile's Security row. Biometric login is a
// genuinely local, real toggle (no backend involved either way — it's a
// device capability flag). Change PIN now has a real three-screen re-auth
// flow (ChangePin -> ChangePinNew -> ChangePinConfirm) — see
// navigation/types.ts for why those are dedicated screens rather than a
// reuse of onboarding's SetPin/ConfirmPin pair.
export default function SecurityScreen({ navigation, route }: Props) {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [showChangedBanner, setShowChangedBanner] = useState(false);

  // ChangePinConfirmScreen navigates back to this *existing* Security
  // instance (three screens deep in the same stack) rather than mounting a
  // fresh one, so a useState initializer reading route.params here would
  // only ever see whatever params existed the first time this screen
  // mounted — it wouldn't fire again on the return trip. This effect is
  // what actually reacts to the param changing on an already-mounted
  // screen: show the banner, then clear the param (so navigating away and
  // back later, e.g. via BottomNav, doesn't keep re-showing a stale
  // banner), then auto-hide after a few seconds.
  useEffect(() => {
    if (route.params?.pinJustChanged) {
      setShowChangedBanner(true);
      navigation.setParams({ pinJustChanged: undefined });
      const timer = setTimeout(() => setShowChangedBanner(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [route.params?.pinJustChanged, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t("common.goBack")}
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">{t("security.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      {showChangedBanner ? (
        <View
          className="mx-6 mt-3 flex-row items-center rounded-2xl px-4 py-3"
          style={{ gap: 8, backgroundColor: colors.success100 }}
        >
          <IconCheck size={16} color={colors.success500} />
          <Text className="text-body font-semibold" style={{ color: colors.success500 }}>
            {t("security.pinUpdated")}
          </Text>
        </View>
      ) : null}

      <View className="mx-6 mt-4 rounded-2xl border border-slate-200 px-4">
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-1 pr-4" style={{ gap: 2 }}>
            <Text className="text-label font-semibold text-slate-900">{t("security.biometricLogin")}</Text>
            <Text className="text-caption text-slate-500">{t("security.biometricLoginSubtitle")}</Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={setBiometricsEnabled}
            trackColor={{ true: colors.brand700, false: colors.neutral200 }}
          />
        </View>
        <View className="h-px bg-slate-100" />
        <SelectRow
          title={t("security.changePin")}
          subtitle={t("security.changePinSubtitle")}
          icon={<IconShield size={18} color={colors.neutral500} />}
          onPress={() => navigation.navigate("ChangePin")}
        />
      </View>

      <View className="mx-6 mt-6 rounded-2xl border border-slate-200 px-4 py-4" style={{ gap: 2 }}>
        <Text className="text-label font-semibold text-slate-900">{t("security.thisDevice")}</Text>
        <Text className="text-caption text-slate-500">{t("security.thisDeviceSubtitle")}</Text>
      </View>
    </SafeAreaView>
  );
}