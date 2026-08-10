import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft } from "../components/icons";
import NumericKeypad from "../components/NumericKeypad";
import Button from "../components/Button";
import { t } from "@/i18n";

// Standing in for the mobile balance shown on Home (Rp 8.240.500), used
// only to power the "Max" quick-amount chip and the insufficient-funds
// check on Transfer. Top Up isn't bounded by this since it's pulling from
// an external source, not spending the app balance.
const MOCK_AVAILABLE_MINOR = 824_050_000;

const QUICK_AMOUNTS = [50_000, 100_000, 500_000];
const MAX_DIGITS = 12; // guards against an unbounded string turning into Infinity/overflow

type Props = NativeStackScreenProps<RootStackParamList, "AmountEntry">;

function formatRupiah(rupiah: number) {
  return rupiah > 0 ? rupiah.toLocaleString("id-ID") : "0";
}

// Shared amount-entry step for both Transfer and Top Up. Deliberately
// generic — it only knows "who/what this amount is for" via contextLabel,
// not which flow it's in beyond validation rules (Transfer can't exceed
// the available balance; Top Up has no such ceiling).
export default function AmountEntryScreen({ navigation, route }: Props) {
  const { flow, contextId, contextLabel, contextSubLabel, maxAmountMinor, feeMinor } = route.params;
  const [digits, setDigits] = useState(""); // raw rupiah digits, no decimals

  const amountRupiah = digits === "" ? 0 : parseInt(digits, 10);
  const amountMinor = amountRupiah * 100;

  // Withdraw always carries an explicit cap (the source pocket's current
  // balance, passed in via route params). Transfer falls back to the mock
  // account balance when no explicit cap is given, matching the original
  // behavior. Top Up has no ceiling — it's pulling from an external source.
  const cap = maxAmountMinor ?? (flow === "transfer" ? MOCK_AVAILABLE_MINOR : undefined);
  const exceedsBalance = cap !== undefined && amountMinor > cap;
  const isValid = amountRupiah > 0 && !exceedsBalance;

  function appendDigit(d: string) {
    setDigits((prev) => (prev.length >= MAX_DIGITS ? prev : prev === "0" ? d : prev + d));
  }
  function backspace() {
    setDigits((prev) => prev.slice(0, -1));
  }
  function setQuickAmount(rupiah: number) {
    setDigits(String(rupiah));
  }
  function setMax() {
    if (cap !== undefined) setDigits(String(Math.floor(cap / 100)));
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
        <View className="items-center">
          <Text className="text-body font-semibold text-slate-500">{contextLabel}</Text>
          {contextSubLabel ? <Text className="text-caption text-slate-500">{contextSubLabel}</Text> : null}
        </View>
        <View className="h-10 w-10" />
      </View>

      <View className="flex-1 items-center justify-end px-6 pb-10" style={{ gap: 16 }}>
        <View className="flex-row items-baseline" style={{ gap: 4 }}>
          <Text className="text-2xl font-semibold text-slate-400">Rp</Text>
          <Text className="text-5xl font-bold text-slate-900">{formatRupiah(amountRupiah)}</Text>
        </View>
        {exceedsBalance ? (
          <Text className="text-body font-medium text-red-600">
            {flow === "withdraw" ? t("amountEntry.exceedsPocketBalance") : t("amountEntry.exceedsAvailableBalance")}
          </Text>
        ) : null}

        <View className="flex-row" style={{ gap: 8 }}>
          {QUICK_AMOUNTS.map((amt) => (
            <Pressable
              key={amt}
              onPress={() => setQuickAmount(amt)}
              className="rounded-full border border-slate-200 px-4 py-2"
            >
              <Text className="text-body font-medium text-slate-700">{amt / 1000}rb</Text>
            </Pressable>
          ))}
          {cap !== undefined ? (
            <Pressable onPress={setMax} className="rounded-full border border-slate-200 px-4 py-2">
              <Text className="text-body font-medium text-slate-700">{t("amountEntry.max")}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View className="px-6 pb-2">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>

      <View className="px-6 pb-4 pt-4">
        <Button
          label={t("common.continue")}
          variant="primary"
          disabled={!isValid}
          onPress={() =>
            navigation.navigate("Confirm", { flow, contextId, contextLabel, contextSubLabel, amountMinor, feeMinor })
          }
        />
      </View>
    </SafeAreaView>
  );
}
