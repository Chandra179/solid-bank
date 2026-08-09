import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCard, IconChevronLeft } from "../components/icons";
import SelectRow from "../components/SelectRow";
import { listFundingSources, listCards } from "@/data";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";

type Props = NativeStackScreenProps<RootStackParamList, "TopUp">;

// Step 1 of the top-up flow: choose where the money comes from. Kept as a
// short flat list (no search) since a user only has a handful of funding
// sources, unlike the potentially long beneficiary list on Transfer.
export default function TopUpScreen({ navigation }: Props) {
  // See useRefreshOnFocus for why: freezing the card on CardsScreen and
  // coming straight back here should immediately show it as unavailable,
  // not the stale pre-freeze state.
  useRefreshOnFocus();

  const sources = listFundingSources();
  // The "Debit Card" funding source and CardsScreen's card are the same
  // physical card (linked via Card.fundingSourceId) — freezing it there
  // should actually block it as a top-up source here, not just say so.
  const frozenSourceIds = new Set(
    listCards()
      .filter((c) => c.frozen && c.fundingSourceId)
      .map((c) => c.fundingSourceId)
  );

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
        <Text className="text-lg font-semibold text-slate-900">Top Up</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1 px-6 pt-4" style={{ gap: 4 }}>
        <Text className="pb-1 text-body font-semibold text-slate-500">Choose a source</Text>
        {sources.map((s) => {
          const frozen = frozenSourceIds.has(s.id);
          return (
            <SelectRow
              key={s.id}
              title={s.name}
              subtitle={frozen ? "Frozen — unfreeze it in Cards to use this source" : s.subtitle}
              icon={<IconCard size={18} color={colors.neutral500} />}
              disabled={frozen}
              disabledLabel="Frozen"
              onPress={() =>
                navigation.navigate("AmountEntry", {
                  flow: "topup",
                  contextId: s.id,
                  contextLabel: `From ${s.name}`,
                  contextSubLabel: s.subtitle,
                })
              }
            />
          );
        })}
        {/* A short, flat list like this one otherwise leaves most of the
            screen blank below the last row — a real, honest note (not
            filler) closes that gap instead of leaving it inert. */}
        <View className="flex-1" />
        <Text className="pb-6 text-center text-caption text-slate-500">
          More funding sources coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}