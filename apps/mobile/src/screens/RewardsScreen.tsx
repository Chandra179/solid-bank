import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconGift } from "../components/icons";
import { getRewardsSummary, listPerks } from "@/data";
import { formatIDR } from "@/utils/currency";

type Props = NativeStackScreenProps<RootStackParamList, "Rewards">;

// Segment-specific rewards, not a generic points system — see
// data/mockRewards.ts's comment for why (the research docs specifically
// warned against building this before a segment was chosen; freelancers/
// gig workers is the wedge this project picked). Cashback is computed from
// real spend categories, and the perks list is anchored to what that
// segment actually spends on (co-working, business tools, cafe meetings)
// rather than a generic shopping-rewards mall.
export default function RewardsScreen({ navigation }: Props) {
  const summary = getRewardsSummary(30);
  const perks = listPerks();

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
        <Text className="text-lg font-semibold text-slate-900">Rewards</Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="items-center px-6 pb-2 pt-4" style={{ gap: 8 }}>
          <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <IconGift size={24} color={colors.brand700} />
          </View>
          <Text className="text-body text-slate-500">Cashback earned · last {summary.periodDays} days</Text>
          <Text className="text-4xl font-bold text-slate-900">{formatIDR(summary.cashbackEarnedMinor)}</Text>
          <Text className="text-caption text-center text-slate-500">
            Automatic — bonus cashback on the categories freelancers spend on most: business
            subscriptions, client-meeting coffee, and getting around.
          </Text>
        </View>

        <View className="px-6 pt-6">
          <Text className="pb-2 text-lg font-semibold text-slate-900">Perks for you</Text>
          <View className="rounded-2xl border border-slate-200 px-4">
            {perks.map((perk, i) => (
              <View key={perk.id}>
                <View className="py-4" style={{ gap: 4 }}>
                  <Text className="text-label font-semibold text-slate-900">{perk.title}</Text>
                  <Text className="text-caption text-slate-500">{perk.description}</Text>
                </View>
                {i < perks.length - 1 ? <View className="h-px bg-slate-100" /> : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
