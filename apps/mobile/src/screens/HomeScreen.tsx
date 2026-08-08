import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconBell, IconMore, IconPocket, IconPlus, IconTransfer, IconBag, IconArrowDownLeft, IconInbox } from "../components/icons";
import QuickAction from "../components/QuickAction";
import PocketCard from "../components/PocketCard";
import TransactionRow from "../components/TransactionRow";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import { getAccountSummary, listPockets, listRecentTransactions } from "@/data";

function formatIDR(minor: number) {
  return `Rp ${Math.round(minor / 100).toLocaleString("id-ID")}`;
}

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const account = getAccountSummary();
  const pockets = listPockets();
  const transactions = listRecentTransactions();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 8 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <View style={{ gap: 2 }}>
            <Text className="text-2xl font-semibold text-slate-900">Good morning, Jack</Text>
            <Text className="text-[13px] text-slate-500">Here's your account today</Text>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
            <IconBell size={20} color={colors.neutral700} />
          </View>
        </View>

        {/* Balance card */}
        <View className="px-6 pb-2 pt-4">
          <View className="rounded-3xl bg-brand-700 p-6" style={{ gap: 20 }}>
            <View style={{ gap: 4 }}>
              <Text className="text-[13px] text-brand-50">Total balance</Text>
              <Text className="text-4xl font-bold text-white">{formatIDR(account.balanceMinor)}</Text>
              <Text className="text-[11px] text-brand-50">{account.accountMask} · IDR</Text>
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
                onPress={() => navigation.navigate("PocketDetail", { pocketId: pockets[0].id })}
              />
              <QuickAction label="More" icon={<IconMore size={22} color={colors.brand700} />} />
            </View>
          </View>
        </View>

        {/* Pockets */}
        <View className="pt-6" style={{ gap: 12 }}>
          <View className="flex-row items-center justify-between px-6">
            <Text className="text-lg font-semibold text-slate-900">Your Pockets</Text>
            <Text className="text-[13px] font-semibold text-brand-700">See all</Text>
          </View>
          {pockets.length === 0 ? (
            <EmptyState
              icon={<IconPocket size={22} color={colors.neutral500} />}
              title="No pockets yet"
              subtitle="Create a pocket to start saving toward a goal."
              actionLabel="Create a pocket"
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
            <Text className="text-[13px] font-semibold text-brand-700">See all</Text>
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
          if (key === "pockets") navigation.navigate("PocketDetail", { pocketId: pockets[0].id });
          if (key === "profile") navigation.navigate("Profile");
        }}
      />
    </SafeAreaView>
  );
}
