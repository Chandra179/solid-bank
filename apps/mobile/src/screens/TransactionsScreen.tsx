import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconArrowDownLeft, IconBag, IconChevronLeft, IconInbox, IconPieChart } from "../components/icons";
import TransactionRow from "../components/TransactionRow";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { useRecentTransactions } from "@/data/queries";

type Props = NativeStackScreenProps<RootStackParamList, "Transactions">;

// Real destination behind Home's "Recent Transactions -> See all", which
// previously had no onPress at all. Reuses the same listRecentTransactions()
// data Home's own 3-item preview already pulls from, just without the cap —
// a second, fuller view onto the same list rather than a separate feed to
// maintain (same relationship PocketsScreen has to Home's pocket row).
export default function TransactionsScreen({ navigation }: Props) {
  const { data: transactions, isLoading } = useRecentTransactions();

  if (isLoading || !transactions) return <LoadingState />;

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
        <Text className="text-lg font-semibold text-slate-900">Transactions</Text>
        <Pressable
          onPress={() => navigation.navigate("SpendingInsights")}
          accessibilityLabel="Spending insights"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconPieChart size={18} color={colors.neutral700} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 8 }}>
        {transactions.length === 0 ? (
          <EmptyState
            icon={<IconInbox size={22} color={colors.neutral500} />}
            title="No transactions yet"
            subtitle="Your activity will show up here once you top up or spend."
          />
        ) : (
          <View className="px-6 pt-2">
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
      </ScrollView>
    </SafeAreaView>
  );
}
