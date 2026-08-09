import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconUser } from "../components/icons";
import Button from "../components/Button";
import { addBeneficiary } from "@/data";

type Props = NativeStackScreenProps<RootStackParamList, "AddRecipient">;

const BANKS = ["BCA", "Mandiri", "BNI", "BRI"];

// Real destination behind Transfer's "Add new recipient" — same
// name+TextInput form pattern as CreatePocketScreen, plus a small chip
// picker for bank (a short fixed list is enough for this prototype rather
// than a full bank directory/lookup). On submit, adds a real beneficiary
// and returns to Transfer, which refreshes on focus (see TransferScreen)
// so the new recipient shows up immediately.
export default function AddRecipientScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [bank, setBank] = useState(BANKS[0]);
  const [accountNumber, setAccountNumber] = useState("");

  const isValid = name.trim().length > 1 && accountNumber.trim().length >= 4;

  function handleAdd() {
    if (!isValid) return;
    const last4 = accountNumber.trim().slice(-4);
    addBeneficiary(name.trim(), `•••• ${last4} · ${bank}`);
    navigation.goBack();
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

      <View className="items-center px-6 pt-2" style={{ gap: 8 }}>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <IconUser size={24} color={colors.brand700} />
        </View>
        <Text className="text-2xl font-semibold text-slate-900">New recipient</Text>
        <Text className="text-center text-body text-slate-500">
          Add their details once and transfer to them anytime.
        </Text>
      </View>

      <View className="px-6 pt-8" style={{ gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Recipient name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Budi Santoso"
            placeholderTextColor={colors.neutral400}
            maxLength={40}
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Bank</Text>
          <View className="flex-row" style={{ gap: 8 }}>
            {BANKS.map((b) => (
              <Pressable
                key={b}
                onPress={() => setBank(b)}
                className="rounded-full border px-4 py-2"
                style={{
                  borderColor: bank === b ? colors.brand700 : colors.neutral200,
                  backgroundColor: bank === b ? colors.brand50 : "transparent",
                }}
              >
                <Text
                  className="text-body font-medium"
                  style={{ color: bank === b ? colors.brand700 : colors.neutral700 }}
                >
                  {b}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Account number</Text>
          <TextInput
            value={accountNumber}
            onChangeText={(t) => setAccountNumber(t.replace(/\D/g, "").slice(0, 20))}
            placeholder="1234567890"
            placeholderTextColor={colors.neutral400}
            keyboardType="number-pad"
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <Button label="Add recipient" variant="primary" disabled={!isValid} onPress={handleAdd} />
      </View>
    </SafeAreaView>
  );
}
