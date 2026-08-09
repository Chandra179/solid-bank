import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft } from "../components/icons";
import Button from "../components/Button";
import { getAccountSummary, getBiller, lookupMockBillAmount } from "@/data";
import { formatIDR } from "@/utils/currency";

type Props = NativeStackScreenProps<RootStackParamList, "BillInput">;

const MIN_LENGTH = 6;

// Step 2 of the bill-payment flow: the customer number that identifies who
// (or which meter/policy) is being paid. Pulsa hands off into AmountEntry
// since the user chooses how much credit to buy; PLN/BPJS "check bill" here
// first (a real inquiry call — mocked via lookupMockBillAmount) and go
// straight to Confirm with that fixed amount, the same dynamic-vs-static
// split QrScanScreen already uses for QRIS codes with a baked-in amount.
export default function BillInputScreen({ navigation, route }: Props) {
  const biller = getBiller(route.params.billType);
  const [number, setNumber] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = number.trim().length >= MIN_LENGTH;

  function handleChange(text: string) {
    setError(null);
    setNumber(text.replace(/\D/g, "").slice(0, 16));
  }

  function handleContinue() {
    if (!isValid) return;

    if (biller.amountMode === "user-entered") {
      navigation.navigate("AmountEntry", {
        flow: "billpay",
        contextId: `${biller.type}:${number}`,
        contextLabel: `${biller.name} · ${number}`,
        // Bill payment spends from the main balance the same way a
        // transfer does — capped the same way Withdraw caps its amount,
        // via an explicit maxAmountMinor rather than AmountEntryScreen's
        // transfer-only fallback constant.
        maxAmountMinor: getAccountSummary().balanceMinor,
      });
      return;
    }

    // "billed" mode: look up the fixed amount due before doing anything
    // else — this is the one step standing in for a real bill-inquiry API
    // call, so it gets its own (brief) loading state rather than resolving
    // instantly like the rest of this mock layer.
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      const amountMinor = lookupMockBillAmount(number);
      const balanceMinor = getAccountSummary().balanceMinor;
      if (amountMinor > balanceMinor) {
        setError(`Insufficient balance — this bill is ${formatIDR(amountMinor)}.`);
        return;
      }
      navigation.navigate("Confirm", {
        flow: "billpay",
        contextId: `${biller.type}:${number}`,
        contextLabel: `${biller.name} · ${number}`,
        amountMinor,
      });
    }, 500);
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <View className="px-6 pt-2" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">{biller.name}</Text>
        <Text className="text-body text-slate-500">
          {biller.amountMode === "user-entered"
            ? `Enter the ${biller.customerLabel.toLowerCase()} to top up.`
            : `Enter the ${biller.customerLabel.toLowerCase()} to check and pay this bill.`}
        </Text>
      </View>

      <View className="px-6 pt-6" style={{ gap: 6 }}>
        <Text className="text-label font-semibold text-slate-700">{biller.customerLabel}</Text>
        <TextInput
          value={number}
          onChangeText={handleChange}
          placeholder={biller.placeholder}
          placeholderTextColor={colors.neutral400}
          keyboardType="number-pad"
          className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
        />
        {error ? <Text className="text-caption font-medium text-red-600">{error}</Text> : null}
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <Button
          label={biller.amountMode === "user-entered" ? "Continue" : "Check bill"}
          variant="primary"
          disabled={!isValid || checking}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}
