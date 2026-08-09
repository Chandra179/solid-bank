import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import {
  IconBell,
  IconQrCode,
  IconPocket,
  IconPlus,
  IconTransfer,
  IconBag,
  IconArrowDownLeft,
  IconInbox,
  IconPieChart,
  IconChevronRight,
  IconReceipt,
} from "../components/icons";
import QuickAction from "../components/QuickAction";
import PocketCard from "../components/PocketCard";
import TransactionRow from "../components/TransactionRow";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import {
  useAccountSummary,
  usePockets,
  useRecentTransactions,
  useUserProfile,
  useNotifications,
  useCategoryBreakdown,
} from "@/data/queries";
import { getGreeting } from "@/utils/greeting";
import { formatIDR } from "@/utils/currency";
import { useTranslation } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { data: account } = useAccountSummary();
  const { data: pockets = [] } = usePockets();
  // Home is a preview, not the full feed (that's TransactionsScreen, via
  // "See all") — capped at 3 now that mockTransactions seeds more than 3
  // entries for SpendingInsightsScreen's category breakdown to have
  // something to break down.
  const { data: allTransactions = [] } = useRecentTransactions();
  const { data: user } = useUserProfile();
  const { data: notifications = [] } = useNotifications();
  // Last-30-day spend total, same source SpendingInsightsScreen's own
  // breakdown reads from — this teaser is the "visible entry point" the
  // full breakdown screen was missing (it already existed and was reachable
  // from Transactions' header, but nothing on Home itself pointed to it).
  const { data: spendBreakdown = [] } = useCategoryBreakdown(30);

  if (!account || !user) return <LoadingState />;

  const transactions = allTransactions.slice(0, 3);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const spendTotalMinor = spendBreakdown.reduce((sum, c) => sum + c.totalMinor, 0);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 8 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <View style={{ gap: 2 }}>
            <Text className="text-2xl font-semibold text-slate-900">{getGreeting()}, {user.name}</Text>
            <Text className="text-body text-slate-500">{t("home.subtitle")}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("Notifications")}
            accessibilityLabel={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
          >
            <IconBell size={20} color={colors.neutral700} />
            {unreadCount > 0 ? (
              <View
                className="absolute right-2 top-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.danger500 }}
              />
            ) : null}
          </Pressable>
        </View>

        {/* Balance card */}
        <View className="px-6 pb-2 pt-4">
          <View className="rounded-3xl bg-brand-700 p-6" style={{ gap: 20 }}>
            <View style={{ gap: 4 }}>
              <Text className="text-body text-brand-50">{t("home.totalBalance")}</Text>
              <Text className="text-4xl font-bold text-white">{formatIDR(account.balanceMinor)}</Text>
              <Text className="text-caption text-brand-50">{account.accountMask} · IDR</Text>
            </View>
            {/* Fixed-width, wrapping grid (see components/QuickAction.tsx's
                container below) rather than flex-row justify-between —
                justify-between silently squeezes every item's spacing
                whenever an action is added, which is exactly what happened
                going from 4 to 5 icons here for Bills. A grid with a fixed
                per-item width instead grows a new row when the next feature
                needs a slot, matching the loading-state/IA rules in
                docs/conventions.md. */}
            <View className="flex-row flex-wrap" style={{ rowGap: 20 }}>
              <View style={{ width: "25%" }}>
                <QuickAction
                  label={t("home.quickActions.topUp")}
                  icon={<IconPlus size={22} color={colors.brand700} />}
                  onPress={() => navigation.navigate("TopUp")}
                />
              </View>
              <View style={{ width: "25%" }}>
                <QuickAction
                  label={t("home.quickActions.transfer")}
                  icon={<IconTransfer size={22} color={colors.brand700} />}
                  onPress={() => navigation.navigate("Transfer")}
                />
              </View>
              {/* QR-first payments takes a primary slot rather than staying
                  behind a "More" catch-all — see QrScanScreen for why: the
                  project's own product priorities call out QRIS as
                  "default, not an afterthought." */}
              <View style={{ width: "25%" }}>
                <QuickAction
                  label={t("home.quickActions.qrPay")}
                  icon={<IconQrCode size={22} color={colors.brand700} />}
                  onPress={() => navigation.navigate("QrScan")}
                />
              </View>
              {/* Bills (Pulsa/PLN/BPJS) — the research docs call bill
                  payment "a near-universal feature in Indonesian
                  banking/fintech apps." */}
              <View style={{ width: "25%" }}>
                <QuickAction
                  label={t("home.quickActions.bills")}
                  icon={<IconReceipt size={22} color={colors.brand700} />}
                  onPress={() => navigation.navigate("Bills")}
                />
              </View>
              {/* Pockets moved to the second row on purpose: it's still one
                  tap away via BottomNav's own "Pockets" tab, so it's the
                  one primary action that can afford to give up a first-row
                  slot to make room for Bills without actually costing a
                  tap in the common case. The next new money-move action
                  (per docs/conventions.md) grows this into a fuller second
                  row instead of squeezing row one again. */}
              <View style={{ width: "25%" }}>
                <QuickAction
                  label={t("home.quickActions.pockets")}
                  icon={<IconPocket size={22} color={colors.brand700} />}
                  onPress={() => navigation.navigate("Pockets")}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Spending insights teaser — a real breakdown screen already
            existed (reachable from Transactions' header) but Home itself,
            the first screen anyone sees, had no pointer to it at all. */}
        <View className="px-6 pt-4">
          <Pressable
            onPress={() => navigation.navigate("SpendingInsights")}
            accessibilityLabel="Spending insights"
            accessibilityRole="button"
            className="flex-row items-center justify-between rounded-2xl border border-slate-200 px-4 py-4"
          >
            <View className="flex-1 flex-row items-center pr-4" style={{ gap: 10 }}>
              <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-50">
                <IconPieChart size={16} color={colors.brand700} />
              </View>
              <View className="flex-1" style={{ gap: 2 }}>
                <Text className="text-label font-semibold text-slate-900">{t("home.spendingInsights")}</Text>
                <Text className="text-caption text-slate-500">
                  {t("home.spendingInsightsSubtitle", { amount: formatIDR(spendTotalMinor) })}
                </Text>
              </View>
            </View>
            <IconChevronRight size={16} color={colors.neutral400} />
          </Pressable>
        </View>

        {/* Pockets */}
        <View className="pt-6" style={{ gap: 12 }}>
          <View className="flex-row items-center justify-between px-6">
            <Text className="text-lg font-semibold text-slate-900">{t("home.yourPockets")}</Text>
            <Text
              onPress={() => navigation.navigate("Pockets")}
              className="text-body font-semibold text-brand-700"
            >
              {t("common.seeAll")}
            </Text>
          </View>
          {pockets.length === 0 ? (
            <EmptyState
              icon={<IconPocket size={22} color={colors.neutral500} />}
              title={t("home.noPockets")}
              subtitle={t("home.noPocketsSubtitle")}
              actionLabel={t("home.createPocket")}
              onAction={() => navigation.navigate("CreatePocket")}
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            >
              {pockets.map((pocket) => (
                <PocketCard
                  key={pocket.id}
                  pocket={pocket}
                  onPress={() => navigation.navigate("PocketDetail", { pocketId: pocket.id })}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recent transactions */}
        <View className="pb-6 pt-6" style={{ gap: 4 }}>
          <View className="flex-row items-center justify-between px-6 pb-2">
            <Text className="text-lg font-semibold text-slate-900">{t("home.recentTransactions")}</Text>
            <Text
              onPress={() => navigation.navigate("Transactions")}
              className="text-body font-semibold text-brand-700"
            >
              {t("common.seeAll")}
            </Text>
          </View>
          {transactions.length === 0 ? (
            <EmptyState
              icon={<IconInbox size={22} color={colors.neutral500} />}
              title={t("home.noTransactions")}
              subtitle={t("home.noTransactionsSubtitle")}
            />
          ) : (
            <View className="px-6">
              {transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  {...tx}
                  icon={
                    tx.amountMinor > 0 ? (
                      <IconArrowDownLeft size={18} color={colors.success500} />
                    ) : (
                      <IconBag size={18} color={colors.neutral700} />
                    )
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNav
        active="home"
        onChange={(key) => {
          if (key === "pockets") navigation.navigate("Pockets");
          if (key === "cards") navigation.navigate("Cards");
          if (key === "profile") navigation.navigate("Profile");
        }}
      />
    </SafeAreaView>
  );
}
