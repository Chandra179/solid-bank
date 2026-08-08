import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconArrowDownLeft, IconArrowUpRight, IconChevronLeft, IconEdit, IconInbox, IconPocket } from "../components/icons";
import Button from "../components/Button";
import TransactionRow from "../components/TransactionRow";
import EmptyState from "../components/EmptyState";
import { getPocket, listPockets, listPocketTransactions } from "@/data";
import { formatIDR } from "@/utils/currency";

type Props = NativeStackScreenProps<RootStackParamList, "PocketDetail">;

export default function PocketDetailScreen({ navigation, route }: Props) {
  // See HomeScreen for why: without this, adding money to this pocket and
  // landing back here (Success -> Done -> ... -> back to this screen)
  // would still show the pre-transfer balance until remounted.
  const [, forceRefresh] = useState(0);
  useFocusEffect(
    useCallback(() => {
      forceRefresh((n) => n + 1);
    }, [])
  );

  // Falls back to the first pocket only as a defensive guard against a bad
  // id ever reaching this screen — every real navigation call passes a
  // known pocket id, so this shouldn't be reachable in practice.
  const pocket = getPocket(route.params.pocketId) ?? listPockets()[0];
  const history = listPocketTransactions(pocket.id);
  const pct = pocket.targetMinor > 0 ? Math.min(1, pocket.savedMinor / pocket.targetMinor) : 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
          >
            <IconChevronLeft size={20} color={colors.neutral700} />
          </Pressable>
          <Text className="text-lg font-semibold text-slate-900">Pocket</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("ComingSoon", {
                title: "Edit pocket",
                message: "Renaming a pocket or changing its goal isn't wired up yet.",
                icon: "edit",
              })
            }
            accessibilityLabel="Edit pocket"
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
          >
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
          <Text className="text-body text-slate-500">
            of {formatIDR(pocket.targetMinor)} goal · {Math.round(pct * 100)}%
          </Text>

          <View className="h-2 w-full rounded-full bg-slate-100">
            <View
              className="h-2 rounded-full"
              style={{ width: `${pct * 100}%`, backgroundColor: colors.success500 }}
            />
          </View>

          <View className="flex-row pt-2" style={{ gap: 12 }}>
            <Button
              label="Add Money"
              variant="primary"
              onPress={() =>
                // Same flow/contextLabel shape TransferScreen's own "Your
                // Pockets" row already uses for moving money into a pocket
                // — this button is just a second entry point into that
                // same AmountEntry -> Confirm -> VerifyPin chain, not a
                // separate flow to maintain.
                navigation.navigate("AmountEntry", { flow: "transfer", contextId: pocket.id, contextLabel: `To ${pocket.name}` })
              }
            />
            <Button
              label="Withdraw"
              variant="secondary"
              onPress={() =>
                navigation.navigate("ComingSoon", {
                  title: "Withdraw",
                  message: "Withdrawing straight from a pocket isn't wired up yet — for now, transfer out from your main balance.",
                  icon: "withdraw",
                })
              }
            />
          </View>
        </View>

        {/* History */}
        <View className="pb-8 pt-4" style={{ gap: 4 }}>
          <Text className="px-6 pb-2 text-lg font-semibold text-slate-900">History</Text>
          {history.length === 0 ? (
            <EmptyState
              icon={<IconInbox size={22} color={colors.neutral500} />}
              title="No activity yet"
              subtitle="Money you add to or take from this pocket will show up here."
            />
          ) : (
            <View className="px-6">
              {history.map((tx) => (
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
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
