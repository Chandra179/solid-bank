import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconReceipt } from "../components/icons";
import SelectRow from "../components/SelectRow";
import { listBillers } from "@/data";

type Props = NativeStackScreenProps<RootStackParamList, "Bills">;

// Step 1 of the bill-payment flow: choose which biller. A near-universal
// feature in Indonesian banking/fintech apps (see TODO.md's gap analysis)
// that had no entry point at all before this — Pulsa (phone credit), PLN
// (electricity), and BPJS Kesehatan (health insurance) are the three most
// commonly bundled billers across Jenius/Jago/Blu-style apps.
export default function BillsScreen({ navigation }: Props) {
  const billers = listBillers();

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
        <Text className="text-lg font-semibold text-slate-900">Bills</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1 px-6 pt-4" style={{ gap: 4 }}>
        <Text className="pb-1 text-body font-semibold text-slate-500">Choose a biller</Text>
        {billers.map((b) => (
          <SelectRow
            key={b.type}
            title={b.name}
            subtitle={b.subtitle}
            icon={<IconReceipt size={18} color={colors.neutral500} />}
            onPress={() => navigation.navigate("BillInput", { billType: b.type })}
          />
        ))}
        <View className="flex-1" />
        <Text className="pb-6 text-center text-caption text-slate-500">More billers coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}
