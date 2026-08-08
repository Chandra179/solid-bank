import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

import { colors } from "../theme/colors";
import { IconBell, IconMore, IconPocket, IconPlus, IconTransfer, IconBag, IconArrowDownLeft } from "../components/icons";
import QuickAction from "../components/QuickAction";
import PocketCard, { type Pocket } from "../components/PocketCard";
import TransactionRow, { type Transaction } from "../components/TransactionRow";
import BottomNav from "../components/BottomNav";

// Mock data standing in for real API calls (GET /api/v1/accounts/:id,
// GET /api/v1/pockets, GET /api/v1/transactions) — the accounts/pockets/
// payments packages in apps/api/internal are still stubs, so there's
// nothing to fetch from yet. Swap these for real `api.*` calls once those
// endpoints exist; keep the shape (minor units, IDs) the same so the swap
// is mechanical.
const MOCK_BALANCE_MINOR = 824_050_000; // Rp 8.240.500
const MOCK_ACCOUNT_MASK = "•••• 4821";

const MOCK_POCKETS: Pocket[] = [
  { id: "pocket_1", name: "Emergency Fund", savedMinor: 240_000_000, targetMinor: 500_000_000 },
  { id: "pocket_2", name: "Bali Trip", savedMinor: 185_000_000, targetMinor: 600_000_000 },
  { id: "pocket_3", name: "New Laptop", savedMinor: 420_000_000, targetMinor: 1_200_000_000 },
];

// Non-null: MOCK_POCKETS is a static non-empty literal above.
const FIRST_POCKET_ID = MOCK_POCKETS[0]!.id;

const MOCK_TRANSACTIONS: Omit<Transaction, "icon">[] = [
  { id: "tx_1", name: "Kopi Kenangan", dateLabel: "Today, 09:41", amountMinor: -3_200_000 },
  { id: "tx_2", name: "Salary — Acme Co.", dateLabel: "Yesterday, 08:00", amountMinor: 650_000_000 },
  { id: "tx_3", name: "Transfer to Pockets", dateLabel: "Yesterday, 07:58", amountMinor: -50_000_000 },
];

function formatIDR(minor: number) {
  return `Rp ${Math.round(minor / 100).toLocaleString("id-ID")}`;
}

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
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
              <Text className="text-4xl font-bold text-white">{formatIDR(MOCK_BALANCE_MINOR)}</Text>
              <Text className="text-[11px] text-brand-50">{MOCK_ACCOUNT_MASK} · IDR</Text>
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
                onPress={() => navigation.navigate("PocketDetail", { pocketId: FIRST_POCKET_ID })}
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            {MOCK_POCKETS.map((pocket) => (
              <PocketCard
                key={pocket.id}
                pocket={pocket}
                onPress={() => navigation.navigate("PocketDetail", { pocketId: pocket.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent transactions */}
        <View className="pb-6 pt-6" style={{ gap: 4 }}>
          <View className="flex-row items-center justify-between px-6 pb-2">
            <Text className="text-lg font-semibold text-slate-900">Recent Transactions</Text>
            <Text className="text-[13px] font-semibold text-brand-700">See all</Text>
          </View>
          <View className="px-6">
            {MOCK_TRANSACTIONS.map((tx) => (
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
