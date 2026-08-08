import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCheck, IconChevronLeft } from "../components/icons";
import { formatIDR } from "@/utils/currency";
import { getMoneyFlowCopy } from "@/utils/moneyFlowCopy";

type Props = NativeStackScreenProps<RootStackParamList, "Receipt">;

// The real destination behind Success's "View receipt" — previously that
// button had no onPress at all. Reuses the exact values VerifyPinScreen
// generated at the moment the transfer/top-up actually completed
// (reference, completedAt), rather than recomputing anything here, so this
// screen is a record of what happened rather than a live re-render of
// "now."
export default function ReceiptScreen({ navigation, route }: Props) {
  const { flow, contextLabel, amountMinor, reference, completedAt } = route.params;
  const copy = getMoneyFlowCopy(flow);

  const completedLabel = new Date(completedAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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
        <Text className="text-lg font-semibold text-slate-900">Receipt</Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView className="flex-1">
        <View className="items-center px-6 pb-6 pt-6" style={{ gap: 12 }}>
          <View className="h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <IconCheck size={24} color={colors.success500} />
          </View>
          <Text className="text-body font-semibold text-success-600" style={{ color: colors.success500 }}>
            Completed
          </Text>
          <Text className="text-4xl font-bold text-slate-900">{formatIDR(amountMinor)}</Text>
        </View>

        <View className="mx-6 rounded-2xl border border-slate-200">
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-body text-slate-500">{copy.preposition}</Text>
            <Text className="text-body font-semibold text-slate-900">{contextLabel.replace(/^(To|From) /, "")}</Text>
          </View>
          <View className="h-px bg-slate-100" />
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-body text-slate-500">Type</Text>
            <Text className="text-body font-semibold text-slate-900">{copy.typeLabel}</Text>
          </View>
          <View className="h-px bg-slate-100" />
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-body text-slate-500">Date</Text>
            <Text className="text-body font-semibold text-slate-900">{completedLabel}</Text>
          </View>
          <View className="h-px bg-slate-100" />
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-body text-slate-500">Reference</Text>
            <Text className="text-body font-semibold text-slate-900">{reference}</Text>
          </View>
          <View className="h-px bg-slate-100" />
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-body text-slate-500">Fee</Text>
            <Text className="text-body font-semibold text-slate-900">Rp 0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
