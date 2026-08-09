import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconInbox } from "../components/icons";
import EmptyState from "../components/EmptyState";
import { getCategoryBreakdown } from "@/data";
import { formatIDR } from "@/utils/currency";

type Props = NativeStackScreenProps<RootStackParamList, "SpendingInsights">;

const PERIOD_DAYS = 30;

// Cycled by index rather than mapped by category name — a fixed palette
// keeps every bar visually distinct without needing a category->color
// table to grow every time a new category shows up in mock data.
const BAR_COLORS = [colors.brand700, colors.success500, colors.warning500, colors.danger500, colors.neutral400];

// One of the two "considered but not built" roadmap items from TODO.md,
// now built: a category breakdown of spending, sourced from the same
// RECENT_TRANSACTIONS list Home/TransactionsScreen already read from
// (getCategoryBreakdown in mockTransactions.ts groups + sums the trailing
// 30 days of outgoing amounts). Reached from TransactionsScreen's header —
// a breakdown of "your activity" belongs one tap from the raw feed it's
// summarizing, not buried in Profile.
export default function SpendingInsightsScreen({ navigation }: Props) {
  const breakdown = getCategoryBreakdown(PERIOD_DAYS);
  const totalMinor = breakdown.reduce((sum, c) => sum + c.totalMinor, 0);

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
        <Text className="text-lg font-semibold text-slate-900">Spending Insights</Text>
        <View className="h-10 w-10" />
      </View>

      {breakdown.length === 0 ? (
        <EmptyState
          icon={<IconInbox size={22} color={colors.neutral500} />}
          title="Nothing to break down yet"
          subtitle="Spend from your account and it'll show up here by category."
        />
      ) : (
        <ScrollView className="flex-1">
          <View className="items-center px-6 pb-2 pt-4" style={{ gap: 2 }}>
            <Text className="text-body text-slate-500">Last {PERIOD_DAYS} days</Text>
            <Text className="text-4xl font-bold text-slate-900">{formatIDR(totalMinor)}</Text>
            <Text className="text-caption text-slate-500">spent across {breakdown.length} categories</Text>
          </View>

          <View className="mx-6 mt-4 rounded-2xl border border-slate-200 px-4">
            {breakdown.map((c, i) => {
              const pct = totalMinor > 0 ? c.totalMinor / totalMinor : 0;
              const barColor = BAR_COLORS[i % BAR_COLORS.length];
              return (
                <View key={c.category} className="py-4" style={{ gap: 6 }}>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-label font-semibold text-slate-900">{c.category}</Text>
                    <Text className="text-label font-semibold text-slate-900">{formatIDR(c.totalMinor)}</Text>
                  </View>
                  <View className="h-2 w-full rounded-full bg-slate-100">
                    <View className="h-2 rounded-full" style={{ width: `${pct * 100}%`, backgroundColor: barColor }} />
                  </View>
                  <Text className="text-caption text-slate-500">
                    {Math.round(pct * 100)}% · {c.count} transaction{c.count === 1 ? "" : "s"}
                  </Text>
                  {i < breakdown.length - 1 ? <View className="h-px bg-slate-100" style={{ marginTop: 8 }} /> : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
