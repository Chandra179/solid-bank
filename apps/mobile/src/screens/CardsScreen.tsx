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
import { setCardFrozen } from "@/data";
import { useCards, useInvalidateData } from "@/data/queries";

type Props = NativeStackScreenProps<RootStackParamList, "Cards">;

// Real destination for BottomNav's "Cards" tab — previously the whole tab
// was a ComingSoon placeholder with nothing behind it at all. Freezing is a
// genuine local toggle (mirrors SecurityScreen's biometric switch): no
// backend needed to make "block new transactions" real within this mock
// layer. "Report lost or stolen" and "Order a new card" stay honest
// ComingSoon gaps — a fraud-ops workflow and physical card issuance are
// both real separate features, not something to fake with a dead button.
export default function CardsScreen({ navigation }: Props) {
  const { data: cards, isLoading } = useCards();
  const invalidate = useInvalidateData();

  const card = cards?.[0];

  if (isLoading) return <LoadingState />;

  if (!card) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <Text className="text-2xl font-semibold text-slate-900">Cards</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-body text-slate-500">No cards to show.</Text>
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
        <Text className="text-2xl font-semibold text-slate-900">Cards</Text>
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
              <Text className="text-caption text-brand-50">Card holder</Text>
              <Text className="text-body font-semibold text-white">{card.holderName}</Text>
            </View>
            <View style={{ gap: 2 }}>
              <Text className="text-caption text-brand-50">Expires</Text>
              <Text className="text-body font-semibold text-white">{card.expiry}</Text>
            </View>
          </View>
          {card.frozen ? (
            <View className="self-start rounded-full bg-white/15 px-3 py-1">
              <Text className="text-caption font-semibold text-white">Frozen</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className="mx-6 mt-6 rounded-2xl border border-slate-200 px-4">
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-1 pr-4" style={{ gap: 2 }}>
            <Text className="text-label font-semibold text-slate-900">Freeze card</Text>
            <Text className="text-caption text-slate-500">
              {card.frozen
                ? "New transactions are blocked until you unfreeze it."
                : "Temporarily block new transactions — reversible any time."}
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
          title="Report lost or stolen"
          subtitle="Block this card and start a replacement"
          icon={<IconAlert size={18} color={colors.neutral500} />}
          onPress={() =>
            navigation.navigate("ComingSoon", {
              title: "Report lost or stolen",
              message: "Fraud reporting isn't wired up yet — this needs a real ops workflow behind it, not just a UI screen.",
              icon: "card",
            })
          }
        />
        <View className="h-px bg-slate-100" />
        <SelectRow
          title="Order a new card"
          subtitle="Physical card issuance"
          icon={<IconPlus size={18} color={colors.neutral500} />}
          onPress={() =>
            navigation.navigate("ComingSoon", {
              title: "Order a new card",
              message: "Card issuance isn't part of this build yet.",
              icon: "card",
            })
          }
        />
      </View>

      <View className="mx-6 mt-6 flex-row items-start rounded-2xl border border-slate-200 px-4 py-4" style={{ gap: 10 }}>
        <IconShield size={16} color={colors.neutral500} />
        <Text className="flex-1 text-caption text-slate-500">
          This is the same card shown as "Debit Card" when topping up — freezing it here also blocks it as a top-up source.
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