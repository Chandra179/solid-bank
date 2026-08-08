import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconBell, IconQrCode, IconPocket, IconPlus, IconTransfer, IconBag, IconArrowDownLeft, IconInbox } from "../components/icons";
import QuickAction from "../components/QuickAction";
import PocketCard from "../components/PocketCard";
import TransactionRow from "../components/TransactionRow";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import { getAccountSummary, getUserProfile, listPockets, listRecentTransactions, getUnreadNotificationCount } from "@/data";
import { getGreeting } from "@/utils/greeting";
import { formatIDR } from "@/utils/currency";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  // Every screen that reads from the mock data layer only recomputes on
  // render, and React Navigation keeps this screen mounted across
  // navigations — so without this, Home's balance/pockets/transactions go
  // stale after e.g. Add Money or Create Pocket until the app is fully
  // remounted. Bumping a dummy counter on focus is enough to force a
  // re-render (and therefore a fresh read) without needing this screen to
  // know *what* changed elsewhere.
  const [, forceRefresh] = useState(0);
  useFocusEffect(
    useCallback(() => {
      forceRefresh((n) => n + 1);
    }, [])
  );

  const account = getAccountSummary();
  const pockets = listPockets();
  const transactions = listRecentTransactions();
  const user = getUserProfile();
  const unreadCount = getUnreadNotificationCount();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 8 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <View style={{ gap: 2 }}>
            <Text className="text-2xl font-semibold text-slate-900">{getGreeting()}, {user.name}</Text>
            <Text className="text-body text-slate-500">Here's your account today</Text>
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
              <Text className="text-body text-brand-50">Total balance</Text>
              <Text className="text-4xl font-bold text-white">{formatIDR(account.balanceMinor)}</Text>
              <Text className="text-caption text-brand-50">{account.accountMask} · IDR</Text>
            </View>
            <View className="flex-row justify-between">
              <QuickAction
                label="Top Up"
                icon={<IconPlus size={22} color={colors.brand700} />}
                onPress={() => navigation.navigate("TopUp")}
              />
              <QuickAction
                label="Transfer"
                icon={<IconTransfer size={22} color={colors.brand700} />}
                onPress={() => navigation.navigate("Transfer")}
              />
              <QuickAction
                label="Pockets"
                icon={<IconPocket size={22} color={colors.brand700} />}
                onPress={() => navigation.navigate("Pockets")}
              />
              {/* QR-first payments takes this slot rather than staying
                  behind a "More" catch-all — see QrScanScreen for why:
                  the project's own product priorities call out QRIS as
                  "default, not an afterthought," so it belongs in the
                  primary action row, not buried a tap deeper. "More" had
                  no real functionality behind it yet anyway. */}
              <QuickAction
                label="QR Pay"
                icon={<IconQrCode size={22} color={colors.brand700} />}
                onPress={() => navigation.navigate("QrScan")}
              />
            </View>
          </View>
        </View>

        {/* Pockets */}
        <View className="pt-6" style={{ gap: 12 }}>
          <View className="flex-row items-center justify-between px-6">
            <Text className="text-lg font-semibold text-slate-900">Your Pockets</Text>
            <Text
              onPress={() => navigation.navigate("Pockets")}
              className="text-body font-semibold text-brand-700"
            >
              See all
            </Text>
          </View>
          {pockets.length === 0 ? (
            <EmptyState
              icon={<IconPocket size={22} color={colors.neutral500} />}
              title="No pockets yet"
              subtitle="Create a pocket to start saving toward a goal."
              actionLabel="Create a pocket"
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
            <Text className="text-lg font-semibold text-slate-900">Recent Transactions</Text>
            <Text
              onPress={() => navigation.navigate("Transactions")}
              className="text-body font-semibold text-brand-700"
            >
              See all
            </Text>
          </View>
          {transactions.length === 0 ? (
            <EmptyState
              icon={<IconInbox size={22} color={colors.neutral500} />}
              title="No transactions yet"
              subtitle="Your activity will show up here once you top up or spend."
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
