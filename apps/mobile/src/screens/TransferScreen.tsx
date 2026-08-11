import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconPlus, IconPocket, IconSearch, IconUser } from "../components/icons";
import SelectRow from "../components/SelectRow";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { usePockets, useBeneficiaries } from "@/data/queries";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Transfer">;

// Step 1 of the transfer flow: choose where the money goes. Your own
// pockets are a quick horizontal row (moving money between your own
// pockets is low-friction, not really "sending" in the risky sense);
// external beneficiaries are a searchable list below. Both lead into the
// same shared AmountEntry screen.
export default function TransferScreen({ navigation }: Props) {
  const [query, setQuery] = useState("");
  const {
    data: pockets = [],
    isLoading: pocketsLoading,
    isError: pocketsError,
    refetch: refetchPockets,
  } = usePockets();
  const {
    data: beneficiaries = [],
    isLoading: beneficiariesLoading,
    isError: beneficiariesError,
    refetch: refetchBeneficiaries,
  } = useBeneficiaries();

  const filteredBeneficiaries = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  if (pocketsError || beneficiariesError) {
    return (
      <ErrorState
        onRetry={() => {
          refetchPockets();
          refetchBeneficiaries();
        }}
      />
    );
  }
  if (pocketsLoading || beneficiariesLoading) return <LoadingState />;

  function goToAmount(contextId: string, contextLabel: string, contextSubLabel?: string) {
    navigation.navigate("AmountEntry", { flow: "transfer", contextId, contextLabel, contextSubLabel });
  }

  function goToAddRecipient() {
    navigation.navigate("AddRecipient");
  }

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
        <Text className="text-lg font-semibold text-slate-900">{t("transfer.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="px-6 pb-2 pt-2">
        <View className="flex-row items-center rounded-full bg-slate-100 px-4 py-3" style={{ gap: 8 }}>
          <IconSearch size={18} color={colors.neutral500} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("transfer.searchPlaceholder")}
            placeholderTextColor={colors.neutral500}
            className="flex-1 text-body text-slate-900"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="pt-4" style={{ gap: 12 }}>
          <Text className="px-6 text-body font-semibold text-slate-500">{t("transfer.yourPockets")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}
          >
            {pockets.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => goToAmount(p.id, t("transfer.toRecipient", { name: p.name }))}
                className="items-center"
                style={{ gap: 8, width: 72 }}
              >
                <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                  <IconPocket size={22} color={colors.brand700} />
                </View>
                <Text className="text-center text-caption font-medium text-slate-700" numberOfLines={2}>
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="px-6 pt-6" style={{ gap: 4 }}>
          <Text className="pb-1 text-body font-semibold text-slate-500">{t("transfer.beneficiaries")}</Text>
          {query.length > 0 && filteredBeneficiaries.length === 0 ? (
            // size 22, not 20 — matches every other EmptyState icon size
            // used across the app.
            <EmptyState
              icon={<IconSearch size={22} color={colors.neutral500} />}
              title={t("transfer.noResultsFor", { query })}
              subtitle={t("transfer.noResultsSubtitle")}
              actionLabel={t("transfer.addNewRecipient")}
              onAction={goToAddRecipient}
            />
          ) : (
            <>
              {filteredBeneficiaries.map((b) => (
                <SelectRow
                  key={b.id}
                  title={b.name}
                  subtitle={b.subtitle}
                  icon={<IconUser size={18} color={colors.neutral500} />}
                  onPress={() => goToAmount(b.id, t("transfer.toRecipient", { name: b.name }), b.subtitle)}
                />
              ))}
              <SelectRow
                title={t("transfer.addNewRecipient")}
                icon={<IconPlus size={18} color={colors.brand700} />}
                onPress={goToAddRecipient}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
