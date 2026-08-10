import React, { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft } from "../components/icons";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationSettings">;

type Category = { key: string; title: string; subtitle: string; defaultOn: boolean };

function getCategories(): Category[] {
  return [
    { key: "transactions", title: t("notificationSettings.transactions"), subtitle: t("notificationSettings.transactionsSubtitle"), defaultOn: true },
    { key: "security", title: t("notificationSettings.security"), subtitle: t("notificationSettings.securitySubtitle"), defaultOn: true },
    { key: "pockets", title: t("notificationSettings.pockets"), subtitle: t("notificationSettings.pocketsSubtitle"), defaultOn: true },
    { key: "promotions", title: t("notificationSettings.promotions"), subtitle: t("notificationSettings.promotionsSubtitle"), defaultOn: false },
  ];
}

// Real destination behind Profile's Notifications row — distinct from
// NotificationsScreen (Home's bell), which is the activity feed itself;
// this is the preferences behind it. Fully real via local state — no
// backend to persist to yet, same caveat as everywhere else in src/data.
export default function NotificationSettingsScreen({ navigation }: Props) {
  const categories = getCategories();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c.key, c.defaultOn]))
  );

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
        <Text className="text-lg font-semibold text-slate-900">{t("notificationSettings.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="mx-6 mt-4 rounded-2xl border border-slate-200 px-4">
        {categories.map((c, i) => (
          <React.Fragment key={c.key}>
            {i > 0 ? <View className="h-px bg-slate-100" /> : null}
            <View className="flex-row items-center justify-between py-4">
              <View className="flex-1 pr-4" style={{ gap: 2 }}>
                <Text className="text-label font-semibold text-slate-900">{c.title}</Text>
                <Text className="text-caption text-slate-500">{c.subtitle}</Text>
              </View>
              <Switch
                value={enabled[c.key]}
                onValueChange={(v) => setEnabled((prev) => ({ ...prev, [c.key]: v }))}
                trackColor={{ true: colors.brand700, false: colors.neutral200 }}
              />
            </View>
          </React.Fragment>
        ))}
      </View>
    </SafeAreaView>
  );
}
