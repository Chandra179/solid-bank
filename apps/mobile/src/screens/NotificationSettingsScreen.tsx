import React, { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft } from "../components/icons";

type Props = NativeStackScreenProps<RootStackParamList, "NotificationSettings">;

type Category = { key: string; title: string; subtitle: string; defaultOn: boolean };

const CATEGORIES: Category[] = [
  { key: "transactions", title: "Transactions", subtitle: "Money in, money out, receipts", defaultOn: true },
  { key: "security", title: "Security alerts", subtitle: "New sign-ins, PIN changes", defaultOn: true },
  { key: "pockets", title: "Pocket goal updates", subtitle: "Progress toward your savings goals", defaultOn: true },
  { key: "promotions", title: "Promotions", subtitle: "Offers, fee-free periods, new features", defaultOn: false },
];

// Real destination behind Profile's Notifications row — distinct from
// NotificationsScreen (Home's bell), which is the activity feed itself;
// this is the preferences behind it. Fully real via local state — no
// backend to persist to yet, same caveat as everywhere else in src/data.
export default function NotificationSettingsScreen({ navigation }: Props) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORIES.map((c) => [c.key, c.defaultOn]))
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">Notifications</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="mx-6 mt-4 rounded-2xl border border-slate-200 px-4">
        {CATEGORIES.map((c, i) => (
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
