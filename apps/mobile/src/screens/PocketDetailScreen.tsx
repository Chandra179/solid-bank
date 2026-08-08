import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

import { colors } from "../theme/colors";
import { IconArrowDownLeft, IconArrowUpRight, IconChevronLeft, IconEdit, IconPocket } from "../components/icons";
import Button from "../components/Button";
import TransactionRow, { type Transaction } from "../components/TransactionRow";
import type { Pocket } from "../components/PocketCard";

// Same caveat as HomeScreen: mock data standing in for a real
// GET /api/v1/pockets/:id call once the `pockets` package (currently a
// stub) has something to return. `route.params.pocketId` is already wired
// through navigation so swapping this lookup for a real fetch is the only
// change needed later.
const MOCK_POCKETS_BY_ID: Record<string, Pocket> = {
  pocket_1: { id: "pocket_1", name: "Emergency Fund", savedMinor: 240_000_000, targetMinor: 500_000_000 },
  pocket_2: { id: "pocket_2", name: "Bali Trip", savedMinor: 185_000_000, targetMinor: 600_000_000 },
  pocket_3: { id: "pocket_3", name: "New Laptop", savedMinor: 420_000_000, targetMinor: 1_200_000_000 },
};

const MOCK_HISTORY: Omit<Transaction, "icon">[] = [
  { id: "h1", name: "Transfer from Main", dateLabel: "3 days ago", amountMinor: 50_000_000 },
  { id: "h2", name: "Auto-save (weekly)", dateLabel: "1 week ago", amountMinor: 20_000_000 },
  { id: "h3", name: "Withdraw to Main", dateLabel: "2 weeks ago", amountMinor: -15_000_000 },
];

function formatIDR(minor: number) {
  return `Rp ${Math.round(minor / 100).toLocaleString("id-ID")}`;
}

type Props = NativeStackScreenProps<RootStackParamList, "PocketDetail">;

export default function PocketDetailScreen({ navigation, route }: Props) {
  const pocket = MOCK_POCKETS_BY_ID[route.params.pocketId] ?? MOCK_POCKETS_BY_ID.pocket_1;
  const pct = pocket.targetMinor > 0 ? Math.min(1, pocket.savedMinor / pocket.targetMinor) : 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <Pressable
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
          >
            <IconChevronLeft size={20} color={colors.neutral700} />
          </Pressable>
          <Text className="text-lg font-semibold text-slate-900">Pocket</Text>
          <Pressable className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
            <IconEdit size={18} color={colors.neutral700} />
          </Pressable>
        </View>

        {/* Hero */}
        <View className="items-center px-6 pb-6 pt-4" style={{ gap: 12 }}>
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <IconPocket size={28} color={colors.brand700} />
          </View>
          <Text className="text-2xl font-semibold text-slate-900">{pocket.name}</Text>
          <Text className="text-4xl font-bold text-slate-900">{formatIDR(pocket.savedMinor)}</Text>
          <Text className="text-[13px] text-slate-500">
            of {formatIDR(pocket.targetMinor)} goal · {Math.round(pct * 100)}%
          </Text>

          <View className="h-2 w-full rounded-full bg-slate-100">
            <View
              className="h-2 rounded-full"
              style={{ width: `${pct * 100}%`, backgroundColor: colors.success500 }}
            />
          </View>

          <View className="flex-row pt-2" style={{ gap: 12 }}>
            <Button label="Add Money" variant="primary" />
            <Button label="Withdraw" variant="secondary" />
          </View>
        </View>

        {/* History */}
        <View className="pb-8 pt-4" style={{ gap: 4 }}>
          <Text className="px-6 pb-2 text-lg font-semibold text-slate-900">History</Text>
          <View className="px-6">
            {MOCK_HISTORY.map((tx) => (
              <TransactionRow
                key={tx.id}
                {...tx}
                icon={
                  tx.amountMinor > 0 ? (
                    <IconArrowDownLeft size={18} color={colors.success500} />
                  ) : (
                    <IconArrowUpRight size={18} color={colors.neutral700} />
                  )
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
