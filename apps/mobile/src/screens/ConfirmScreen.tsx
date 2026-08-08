import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { IconChevronLeft } from "../components/icons";
import { colors } from "../theme/colors";
import Button from "../components/Button";
import { formatIDR } from "@/utils/currency";

type Props = NativeStackScreenProps<RootStackParamList, "Confirm">;

// Deliberate review step between "how much" and "it happened." This is
// where a user catches a typo'd recipient or a wrong digit before money
// actually moves — real bank apps (and this app's own audit/reconciliation
// design in apps/api/internal/audit) treat every money movement as
// something a human explicitly confirmed, not something that just occurs
// as a side effect of filling out a form.
//
// This screen no longer submits anything itself — "Confirm" hands off to
// VerifyPinScreen, which is the actual last gate (PIN re-entry) before
// money moves. Review-and-confirm and step-up authentication are two
// different jobs; splitting them keeps each screen doing one thing.
export default function ConfirmScreen({ navigation, route }: Props) {
  const { flow, contextId, contextLabel, contextSubLabel, amountMinor } = route.params;

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
        <Text className="text-lg font-semibold text-slate-900">Review</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="items-center px-6 pt-6" style={{ gap: 4 }}>
        <Text className="text-body text-slate-500">{flow === "transfer" ? "You're sending" : "You're topping up"}</Text>
        <Text className="text-4xl font-bold text-slate-900">{formatIDR(amountMinor)}</Text>
      </View>

      <View className="mx-6 mt-8 rounded-2xl border border-slate-200" style={{ gap: 0 }}>
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-body text-slate-500">{flow === "transfer" ? "To" : "From"}</Text>
          <View className="items-end">
            <Text className="text-body font-semibold text-slate-900">{contextLabel.replace(/^(To|From) /, "")}</Text>
            {contextSubLabel ? <Text className="text-caption text-slate-500">{contextSubLabel}</Text> : null}
          </View>
        </View>
        <View className="h-px bg-slate-100" />
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-body text-slate-500">Amount</Text>
          <Text className="text-body font-semibold text-slate-900">{formatIDR(amountMinor)}</Text>
        </View>
        <View className="h-px bg-slate-100" />
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-body text-slate-500">Fee</Text>
          <Text className="text-body font-semibold text-slate-900">Rp 0</Text>
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4" style={{ gap: 12 }}>
        <Button
          label="Confirm"
          variant="primary"
          onPress={() => navigation.navigate("VerifyPin", { flow, contextId, contextLabel, contextSubLabel, amountMinor })}
        />
        <Pressable onPress={() => navigation.goBack()} className="items-center py-2">
          <Text className="text-body font-semibold text-slate-500">Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
