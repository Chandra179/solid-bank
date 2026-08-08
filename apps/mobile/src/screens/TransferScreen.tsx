import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconPlus, IconPocket, IconSearch, IconUser } from "../components/icons";
import SelectRow from "../components/SelectRow";

// Same mock-data caveat as Home/PocketDetail: standing in for real
// GET /api/v1/pockets and GET /api/v1/beneficiaries calls.
const MOCK_POCKETS = [
  { id: "pocket_1", name: "Emergency Fund" },
  { id: "pocket_2", name: "Bali Trip" },
  { id: "pocket_3", name: "New Laptop" },
];

const MOCK_BENEFICIARIES = [
  { id: "ben_1", name: "Sarah Putri", subtitle: "•••• 1092 · BCA" },
  { id: "ben_2", name: "Andi Wijaya", subtitle: "•••• 4471 · Mandiri" },
  { id: "ben_3", name: "Kos Melati (Rent)", subtitle: "•••• 2201 · BNI" },
];

type Props = NativeStackScreenProps<RootStackParamList, "Transfer">;

// Step 1 of the transfer flow: choose where the money goes. Your own
// pockets are a quick horizontal row (moving money between your own
// pockets is low-friction, not really "sending" in the risky sense);
// external beneficiaries are a searchable list below. Both lead into the
// same shared AmountEntry screen.
export default function TransferScreen({ navigation }: Props) {
  const [query, setQuery] = useState("");

  const filteredBeneficiaries = MOCK_BENEFICIARIES.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  function goToAmount(contextId: string, contextLabel: string, contextSubLabel?: string) {
    navigation.navigate("AmountEntry", { flow: "transfer", contextId, contextLabel, contextSubLabel });
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">Transfer</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="px-6 pb-2 pt-2">
        <View className="flex-row items-center rounded-full bg-slate-100 px-4 py-3" style={{ gap: 8 }}>
          <IconSearch size={18} color={colors.neutral500} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search name or account number"
            placeholderTextColor={colors.neutral400}
            className="flex-1 text-[13px] text-slate-900"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="pt-4" style={{ gap: 12 }}>
          <Text className="px-6 text-[13px] font-semibold text-slate-500">Your Pockets</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}
          >
            {MOCK_POCKETS.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => goToAmount(p.id, `To ${p.name}`)}
                className="items-center"
                style={{ gap: 8, width: 72 }}
              >
                <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                  <IconPocket size={22} color={colors.brand700} />
                </View>
                <Text className="text-center text-[11px] font-medium text-slate-700" numberOfLines={2}>
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="px-6 pt-6" style={{ gap: 4 }}>
          <Text className="pb-1 text-[13px] font-semibold text-slate-500">Beneficiaries</Text>
          {filteredBeneficiaries.map((b) => (
            <SelectRow
              key={b.id}
              title={b.name}
              subtitle={b.subtitle}
              icon={<IconUser size={18} color={colors.neutral500} />}
              onPress={() => goToAmount(b.id, `To ${b.name}`, b.subtitle)}
            />
          ))}
          <SelectRow
            title="Add new recipient"
            icon={<IconPlus size={18} color={colors.brand700} />}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
