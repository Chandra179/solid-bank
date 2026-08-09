import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconArrowDownLeft, IconArrowUpRight, IconBolt, IconChevronLeft, IconEdit, IconInbox, IconPocket } from "../components/icons";
import Button from "../components/Button";
import TransactionRow from "../components/TransactionRow";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { adjustPocketBalance, getPocket, recordPocketTransaction } from "@/data";
import { formatIDR } from "@/utils/currency";
import { usePockets, usePocketTransactions, useInvalidateData } from "@/data/queries";
import { getPocketPaceMessage, getPocketPaceStatus, pocketPaceColor } from "@/utils/pocketPacing";
import { getInitials } from "@/utils/initials";

type Props = NativeStackScreenProps<RootStackParamList, "PocketDetail">;

export default function PocketDetailScreen({ navigation, route }: Props) {
  const { data: pockets, isLoading: pocketsLoading } = usePockets();
  const { data: history = [], isLoading: historyLoading } = usePocketTransactions(route.params.pocketId);
  const invalidate = useInvalidateData();

  if (pocketsLoading || historyLoading || !pockets) return <LoadingState />;

  // Falls back to the first pocket only as a defensive guard against a bad
  // id ever reaching this screen — every real navigation call passes a
  // known pocket id, so this shouldn't be reachable in practice.
  const pocket = getPocket(route.params.pocketId) ?? pockets[0];
  const pct = pocket.targetMinor > 0 ? Math.min(1, pocket.savedMinor / pocket.targetMinor) : 0;
  const paceStatus = getPocketPaceStatus(pocket);
  const paceColor = pocketPaceColor(paceStatus);
  const targetDateLabel = pocket.targetDate
    ? new Date(pocket.targetDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : undefined;
  const paceMessage = getPocketPaceMessage(paceStatus, targetDateLabel);

  // The growth mechanic on top of pockets: there's no real background
  // scheduler in this mock layer, so "one week's auto-save ran" is
  // simulated on demand instead of on a timer — an honest stand-in rather
  // than faking a cron job client-side. Unlike Add Money/Withdraw (which
  // already get their own Success/Receipt confirmation), this records a
  // history entry directly since a boost has no separate confirmation
  // screen of its own.
  function handleBoost() {
    if (!pocket.autoSaveMinor) return;
    adjustPocketBalance(pocket.id, pocket.autoSaveMinor);
    recordPocketTransaction(pocket.id, "Auto-save boost", pocket.autoSaveMinor);
    invalidate();
  }

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
            onPress={() => navigation.navigate("EditPocket", { pocketId: pocket.id })}
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
              style={{ width: `${pct * 100}%`, backgroundColor: paceColor }}
            />
          </View>
          {/* Only pockets with a target date get an evaluative pace
              message (see utils/pocketPacing.ts) — otherwise this is null
              and nothing renders, same as before target dates existed. */}
          {paceMessage ? (
            <Text className="text-caption font-semibold" style={{ color: paceColor }}>
              {paceMessage}
            </Text>
          ) : null}

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
              disabled={pocket.savedMinor <= 0}
              onPress={() =>
                navigation.navigate("AmountEntry", {
                  flow: "withdraw",
                  contextId: pocket.id,
                  contextLabel: `From ${pocket.name}`,
                  maxAmountMinor: pocket.savedMinor,
                })
              }
            />
          </View>
        </View>

        {/* Auto-save */}
        {pocket.autoSaveMinor ? (
          <View className="mx-6 mb-2 flex-row items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
            <View className="flex-1 flex-row items-center pr-4" style={{ gap: 10 }}>
              <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-50">
                <IconBolt size={16} color={colors.brand700} />
              </View>
              <View className="flex-1" style={{ gap: 2 }}>
                <Text className="text-label font-semibold text-slate-900">Auto-save is on</Text>
                <Text className="text-caption text-slate-500">{formatIDR(pocket.autoSaveMinor)} / week</Text>
              </View>
            </View>
            <Button label="Boost now" variant="secondary" onPress={handleBoost} />
          </View>
        ) : (
          <Pressable
            onPress={() => navigation.navigate("EditPocket", { pocketId: pocket.id })}
            className="mx-6 mb-2 flex-row items-center rounded-2xl border border-dashed border-slate-200 px-4 py-4"
            style={{ gap: 10 }}
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <IconBolt size={16} color={colors.neutral500} />
            </View>
            <View className="flex-1" style={{ gap: 2 }}>
              <Text className="text-label font-semibold text-slate-900">Set up auto-save</Text>
              <Text className="text-caption text-slate-500">Grow this pocket automatically every week.</Text>
            </View>
          </Pressable>
        )}

        {/* Shared/group pockets — participants are mock/display data (see
            data/types.ts's Pocket.participants comment for why); "Request a
            contribution" is a genuine ComingSoon gap rather than a fake
            action, since a real per-participant invite/notify flow needs
            infrastructure (multi-user auth, push) this app doesn't have. */}
        {pocket.participants && pocket.participants.length > 0 ? (
          <View className="mx-6 mb-2 rounded-2xl border border-slate-200 p-4" style={{ gap: 12 }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-label font-semibold text-slate-900">Shared with</Text>
              <Text className="text-caption text-slate-500">{pocket.participants.length} people</Text>
            </View>
            <View style={{ gap: 10 }}>
              {pocket.participants.map((p) => (
                <View key={p.id} className="flex-row items-center justify-between">
                  <View className="flex-row items-center" style={{ gap: 10 }}>
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-brand-50">
                      <Text className="text-caption font-bold text-brand-700">{getInitials(p.name)}</Text>
                    </View>
                    <Text className="text-label text-slate-900">{p.name}</Text>
                  </View>
                  <Text className="text-caption font-semibold text-slate-500">
                    {formatIDR(p.contributedMinor)} contributed
                  </Text>
                </View>
              ))}
            </View>
            <Button
              label="Request a contribution"
              variant="secondary"
              onPress={() =>
                navigation.navigate("ComingSoon", {
                  title: "Request a contribution",
                  message: "Asking a participant to chip in will notify them directly once shared pockets support multiple accounts.",
                  icon: "help",
                })
              }
            />
          </View>
        ) : null}

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
