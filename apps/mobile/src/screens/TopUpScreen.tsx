import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCard, IconChevronLeft, IconWallet } from "../components/icons";
import SelectRow from "../components/SelectRow";
import LoadingState from "../components/LoadingState";
import { useFundingSources, useCards } from "@/data/queries";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "TopUp">;

// Step 1 of the top-up flow: choose where the money comes from. Kept as a
// short flat list (no search) since a user only has a handful of funding
// sources, unlike the potentially long beneficiary list on Transfer.
export default function TopUpScreen({ navigation }: Props) {
  const { data: sources = [], isLoading: sourcesLoading } = useFundingSources();
  const { data: cards = [], isLoading: cardsLoading } = useCards();

  // The "Debit Card" funding source and CardsScreen's card are the same
  // physical card (linked via Card.fundingSourceId) — freezing it there
  // should actually block it as a top-up source here, not just say so.
  // Reading cards through useCards() (rather than a direct listCards()
  // call) is what makes this reflect a freeze toggled on CardsScreen
  // immediately: freezing there calls useInvalidateData(), which busts this
  // screen's cached cards query too.
  const frozenSourceIds = new Set(
    cards.filter((c) => c.frozen && c.fundingSourceId).map((c) => c.fundingSourceId)
  );

  if (sourcesLoading || cardsLoading) return <LoadingState />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t("common.goBack")}
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">{t("topUp.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1 px-6 pt-4" style={{ gap: 4 }}>
        <Text className="pb-1 text-body font-semibold text-slate-500">{t("topUp.chooseASource")}</Text>
        {sources.map((s) => {
          const frozen = frozenSourceIds.has(s.id);
          return (
            <SelectRow
              key={s.id}
              title={s.name}
              subtitle={frozen ? t("topUp.frozenSubtitle") : s.subtitle}
              icon={
                s.kind === "ewallet" ? (
                  <IconWallet size={18} color={colors.neutral500} />
                ) : (
                  <IconCard size={18} color={colors.neutral500} />
                )
              }
              disabled={frozen}
              disabledLabel={t("topUp.frozenLabel")}
              onPress={() =>
                navigation.navigate("AmountEntry", {
                  flow: "topup",
                  contextId: s.id,
                  contextLabel: t("topUp.fromSource", { name: s.name }),
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
          {t("topUp.moreSourcesComingSoon")}
        </Text>
      </View>
    </SafeAreaView>
  );
}