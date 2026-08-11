import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconArrowDownLeft, IconChevronLeft, IconInbox, IconPocket, IconQrCode, IconShield } from "../components/icons";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { markNotificationRead } from "@/data";
import { useNotifications, useInvalidateData } from "@/data/queries";
import type { NotificationCategory } from "@/data/mockNotifications";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;

// Per-category icon, same spirit as HomeScreen's transaction rows picking
// an icon by sign rather than storing one in the data itself.
const CATEGORY_ICON: Record<NotificationCategory, (color: string) => React.ReactNode> = {
  transaction: (c) => <IconArrowDownLeft size={18} color={c} />,
  security: (c) => <IconShield size={18} color={c} />,
  promo: (c) => <IconQrCode size={18} color={c} />,
  pocket: (c) => <IconPocket size={18} color={c} />,
};

// Real destination behind Home's bell icon. Tapping a notification marks it
// read (mockNotifications.markNotificationRead) — a local re-render counter
// picks up the change immediately since this screen mutates the same
// module-level array it just read, no navigation/focus round-trip needed.
export default function NotificationsScreen({ navigation }: Props) {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const invalidate = useInvalidateData();

  function handlePress(id: string) {
    markNotificationRead(id);
    invalidate();
  }

  // isError checked before the `!notifications` loading fallback — see
  // PocketsScreen for why (`data` is undefined in both the loading AND
  // the error case, so isLoading-only guards would swallow a real error).
  if (isError) return <ErrorState onRetry={refetch} />;
  if (isLoading || !notifications) return <LoadingState />;

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
        <Text className="text-lg font-semibold text-slate-900">{t("notificationsScreen.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<IconInbox size={22} color={colors.neutral500} />}
          title={t("notificationsScreen.emptyTitle")}
          subtitle={t("notificationsScreen.emptySubtitle")}
        />
      ) : (
        // Wrapped (rather than letting ScrollView sit directly under the
        // header) so a short list — a handful of notifications is common —
        // still pins a real closing note to the true bottom of the screen
        // instead of leaving the space below the last row blank.
        <View className="flex-1">
          <ScrollView className="flex-1 px-6">
            {notifications.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => handlePress(n.id)}
                className="flex-row items-start py-3"
                style={{ gap: 12 }}
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  {CATEGORY_ICON[n.category](colors.neutral700)}
                </View>
                <View className="flex-1" style={{ gap: 2 }}>
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                    <Text className="text-label font-semibold text-slate-900" numberOfLines={1}>
                      {n.title}
                    </Text>
                    {!n.read ? <View className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.danger500 }} /> : null}
                  </View>
                  <Text className="text-body text-slate-500">{n.message}</Text>
                  <Text className="text-caption text-slate-500">{n.dateLabel}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <Text className="pb-4 pt-2 text-center text-caption text-slate-500">{t("notificationsScreen.thatsEverything")}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
