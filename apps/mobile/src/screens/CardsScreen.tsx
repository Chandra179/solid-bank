import React from "react";
import { Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconAlert, IconPlus, IconShield } from "../components/icons";
import BottomNav from "../components/BottomNav";
import SelectRow from "../components/SelectRow";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { setCardFrozen } from "@/data";
import { useCards, useInvalidateData } from "@/data/queries";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Cards">;

// Real destination for BottomNav's "Cards" tab — previously the whole tab
// was a ComingSoon placeholder with nothing behind it at all. Freezing is a
// genuine local toggle (mirrors SecurityScreen's biometric switch): no
// backend needed to make "block new transactions" real within this mock
// layer. "Report lost or stolen" and "Order a new card" stay honest
// ComingSoon gaps — a fraud-ops workflow and physical card issuance are
// both real separate features, not something to fake with a dead button.
export default function CardsScreen({ navigation }: Props) {
  const { data: cards, isLoading, isError, refetch } = useCards();
  const invalidate = useInvalidateData();

  const card = cards?.[0];

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState onRetry={refetch} />;

  if (!card) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <Text className="text-2xl font-semibold text-slate-900">{t("cards.title")}</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-body text-slate-500">{t("cards.noCards")}</Text>
        </View>
        <BottomNav
          active="cards"
          onChange={(key) => {
            if (key === "home") navigation.navigate("Home");
            if (key === "pockets") navigation.navigate("Pockets");
            if (key === "profile") navigation.navigate("Profile");
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Text className="text-2xl font-semibold text-slate-900">{t("cards.title")}</Text>
      </View>

      <View className="px-6 pt-4">
        <View
          className="rounded-3xl p-6"
          style={{ gap: 28, backgroundColor: card.frozen ? colors.neutral700 : colors.brand700 }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-body font-semibold text-white">{card.label}</Text>
            <Text className="text-body font-bold text-white">{card.network.toUpperCase()}</Text>
          </View>
          <Text className="text-2xl font-semibold tracking-widest text-white">•••• •••• •••• {card.last4}</Text>
          <View className="flex-row items-center justify-between">
            <View style={{ gap: 2 }}>
              <Text className="text-caption text-brand-50">{t("cards.cardHolder")}</Text>
              <Text className="text-body font-semibold text-white">{card.holderName}</Text>
            </View>
            <View style={{ gap: 2 }}>
              <Text className="text-caption text-brand-50">{t("cards.expires")}</Text>
              <Text className="text-body font-semibold text-white">{card.expiry}</Text>
            </View>
          </View>
          {card.frozen ? (
            <View className="self-start rounded-full bg-white/15 px-3 py-1">
              <Text className="text-caption font-semibold text-white">{t("cards.frozen")}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className="mx-6 mt-6 rounded-2xl border border-slate-200 px-4">
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-1 pr-4" style={{ gap: 2 }}>
            <Text className="text-label font-semibold text-slate-900">{t("cards.freezeCard")}</Text>
            <Text className="text-caption text-slate-500">
              {card.frozen ? t("cards.freezeCardOnDesc") : t("cards.freezeCardOffDesc")}
            </Text>
          </View>
          <Switch
            value={card.frozen}
            onValueChange={(next) => {
              setCardFrozen(card.id, next);
              invalidate();
            }}
            trackColor={{ true: colors.brand700, false: colors.neutral200 }}
          />
        </View>
      </View>

      <View className="mx-6 mt-6 rounded-2xl border border-slate-200 px-4">
        <SelectRow
          title={t("cards.reportLostTitle")}
          subtitle={t("cards.reportLostSubtitle")}
          icon={<IconAlert size={18} color={colors.neutral500} />}
          onPress={() =>
            navigation.navigate("ComingSoon", {
              title: t("cards.reportLostTitle"),
              message: t("cards.reportLostMessage"),
              icon: "card",
            })
          }
        />
        <View className="h-px bg-slate-100" />
        <SelectRow
          title={t("cards.orderNewTitle")}
          subtitle={t("cards.orderNewSubtitle")}
          icon={<IconPlus size={18} color={colors.neutral500} />}
          onPress={() =>
            navigation.navigate("ComingSoon", {
              title: t("cards.orderNewTitle"),
              message: t("cards.orderNewMessage"),
              icon: "card",
            })
          }
        />
      </View>

      <View className="mx-6 mt-6 flex-row items-start rounded-2xl border border-slate-200 px-4 py-4" style={{ gap: 10 }}>
        <IconShield size={16} color={colors.neutral500} />
        <Text className="flex-1 text-caption text-slate-500">
          {t("cards.debitCardNote")}
        </Text>
      </View>

      <BottomNav
        active="cards"
        onChange={(key) => {
          if (key === "home") navigation.navigate("Home");
          if (key === "pockets") navigation.navigate("Pockets");
          if (key === "profile") navigation.navigate("Profile");
        }}
      />
    </SafeAreaView>
  );
}