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
import ErrorState from "../components/ErrorState";
import { adjustPocketBalance, getPocket, recordPocketTransaction, requestPocketContribution } from "@/data";
import { formatIDR } from "@/utils/currency";
import { usePockets, usePocketTransactions, useInvalidateData } from "@/data/queries";
import { getPocketPaceMessage, getPocketPaceStatus, pocketPaceColor } from "@/utils/pocketPacing";
import { getInitials } from "@/utils/initials";
import { formatRelativeDate } from "@/utils/relativeDate";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "PocketDetail">;

export default function PocketDetailScreen({ navigation, route }: Props) {
  const { data: pockets, isLoading: pocketsLoading, isError: pocketsError, refetch: refetchPockets } = usePockets();
  const {
    data: history = [],
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = usePocketTransactions(route.params.pocketId);
  const invalidate = useInvalidateData();

  // isError checked before the `!pockets` loading fallback — see
  // PocketsScreen for why. Retries both queries since either one failing
  // means this screen has nothing valid to show.
  if (pocketsError || historyError) {
    return (
      <ErrorState
        onRetry={() => {
          refetchPockets();
          refetchHistory();
        }}
      />
    );
  }
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

  // Real, if modest, action behind "Request a contribution" — was a
  // ComingSoon placeholder. There's no multi-user auth/push infrastructure
  // to actually notify Rani or Deni's own device (still true, still a real
  // gap for a future backend), but recording that a request happened is
  // something this mock layer can do honestly: requestPocketContribution
  // sets a real timestamp per participant, and the row below reflects it
  // (button -> "Requested ..." label) the same way every other mutation in
  // this app does.
  function handleRequestContribution(participantId: string) {
    requestPocketContribution(pocket.id, participantId);
    invalidate();
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityLabel={t("common.goBack")}
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
          >
            <IconChevronLeft size={20} color={colors.neutral700} />
          </Pressable>
          <Text className="text-lg font-semibold text-slate-900">{t("pocketDetail.title")}</Text>
          <Pressable
            onPress={() => navigation.navigate("EditPocket", { pocketId: pocket.id })}
            accessibilityLabel={t("pocketDetail.editLabel")}
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
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
            {t("pocketDetail.ofGoal", { target: formatIDR(pocket.targetMinor), pct: Math.round(pct * 100) })}
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
              label={t("pocketDetail.addMoney")}
              variant="primary"
              onPress={() =>
                // Same flow/contextLabel shape TransferScreen's own "Your
                // Pockets" row already uses for moving money into a pocket
                // — this button is just a second entry point into that
                // same AmountEntry -> Confirm -> VerifyPin chain, not a
                // separate flow to maintain.
                navigation.navigate("AmountEntry", { flow: "transfer", contextId: pocket.id, contextLabel: t("pocketDetail.toPocket", { name: pocket.name }) })
              }
            />
            <Button
              label={t("pocketDetail.withdraw")}
              variant="secondary"
              disabled={pocket.savedMinor <= 0}
              onPress={() =>
                navigation.navigate("AmountEntry", {
                  flow: "withdraw",
                  contextId: pocket.id,
                  contextLabel: t("pocketDetail.fromPocket", { name: pocket.name }),
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
                <Text className="text-label font-semibold text-slate-900">{t("pocketDetail.autoSaveOn")}</Text>
                <Text className="text-caption text-slate-500">{t("pocketDetail.perWeek", { amount: formatIDR(pocket.autoSaveMinor) })}</Text>
              </View>
            </View>
            <Button label={t("pocketDetail.boostNow")} variant="secondary" onPress={handleBoost} />
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
              <Text className="text-label font-semibold text-slate-900">{t("pocketDetail.setUpAutoSave")}</Text>
              <Text className="text-caption text-slate-500">{t("pocketDetail.setUpAutoSaveDesc")}</Text>
            </View>
          </Pressable>
        )}

        {/* Shared/group pockets — participants are mock/display data (see
            data/types.ts's Pocket.participants comment for why). "Request a
            contribution" used to be a single button behind a ComingSoon
            placeholder; now it's a real per-participant action —
            requestPocketContribution records a genuine timestamp, and each
            row reflects it (button -> "Requested ..." label) instead of
            every tap leading to the same dead end. Still short of an actual
            notify-the-other-person effect, which needs multi-user auth/push
            this app doesn't have — "You" never gets a request button since
            you can't request a contribution from yourself. */}
        {pocket.participants && pocket.participants.length > 0 ? (
          <View className="mx-6 mb-2 rounded-2xl border border-slate-200 p-4" style={{ gap: 12 }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-label font-semibold text-slate-900">{t("pocketDetail.sharedWith")}</Text>
              <Text className="text-caption text-slate-500">{t("pocketDetail.peopleCount", { count: pocket.participants.length })}</Text>
            </View>
            <View style={{ gap: 10 }}>
              {pocket.participants.map((p) => (
                <View key={p.id} className="flex-row items-center justify-between">
                  <View className="flex-1 flex-row items-center pr-3" style={{ gap: 10 }}>
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-brand-50">
                      <Text className="text-caption font-bold text-brand-700">{getInitials(p.name)}</Text>
                    </View>
                    <View style={{ gap: 1 }}>
                      <Text className="text-label text-slate-900">{p.name}</Text>
                      <Text className="text-caption font-semibold text-slate-500">
                        {t("pocketDetail.contributed", { amount: formatIDR(p.contributedMinor) })}
                      </Text>
                    </View>
                  </View>
                  {p.id === "you" ? null : p.requestedAt ? (
                    <Text className="text-caption font-semibold text-slate-500">
                      {t("pocketDetail.requested", { when: formatRelativeDate(p.requestedAt) })}
                    </Text>
                  ) : (
                    <Pressable
                      onPress={() => handleRequestContribution(p.id)}
                      className="rounded-full bg-slate-100 px-3 py-1.5"
                    >
                      <Text className="text-caption font-semibold text-slate-700">
                        {t("pocketDetail.requestContribution")}
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* History */}
        <View className="pb-8 pt-4" style={{ gap: 4 }}>
          <Text className="px-6 pb-2 text-lg font-semibold text-slate-900">{t("pocketDetail.historyTitle")}</Text>
          {history.length === 0 ? (
            <EmptyState
              icon={<IconInbox size={22} color={colors.neutral500} />}
              title={t("pocketDetail.noActivityTitle")}
              subtitle={t("pocketDetail.noActivitySubtitle")}
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
