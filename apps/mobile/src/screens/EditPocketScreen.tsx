import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconPocket } from "../components/icons";
import Button from "../components/Button";
import { getPocket, listPockets, updatePocket } from "@/data";

type Props = NativeStackScreenProps<RootStackParamList, "EditPocket">;

function formatRupiahInput(digits: string) {
  const n = digits === "" ? 0 : parseInt(digits, 10);
  return n > 0 ? n.toLocaleString("id-ID") : "";
}

// Real destination behind PocketDetail's pencil icon — mirrors
// CreatePocketScreen's form (name + goal), pre-filled from the existing
// pocket instead of starting blank, and calls updatePocket() instead of
// addPocket() on submit. Deliberately can't edit savedMinor here — that
// only ever changes through Add Money/Withdraw (adjustPocketBalance), never
// a direct field edit, so a rename can't silently wipe out a real balance.
export default function EditPocketScreen({ navigation, route }: Props) {
  const pocket = getPocket(route.params.pocketId) ?? listPockets()[0];
  const [name, setName] = useState(pocket.name);
  const [goalDigits, setGoalDigits] = useState(String(Math.floor(pocket.targetMinor / 100)));

  const goalRupiah = goalDigits === "" ? 0 : parseInt(goalDigits, 10);
  const isValid = name.trim().length > 1 && goalRupiah > 0;

  function handleGoalChange(text: string) {
    setGoalDigits(text.replace(/\D/g, "").slice(0, 12));
  }

  function handleSave() {
    if (!isValid) return;
    updatePocket(pocket.id, { name: name.trim(), targetMinor: goalRupiah * 100 });
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
          <IconPocket size={24} color={colors.brand700} />
        </View>
        <Text className="text-2xl font-semibold text-slate-900">Edit pocket</Text>
        <Text className="text-center text-body text-slate-500">
          Rename this pocket or update its goal — its saved balance won't change.
        </Text>
      </View>

      <View className="px-6 pt-8" style={{ gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Pocket name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. New Phone"
            placeholderTextColor={colors.neutral400}
            maxLength={40}
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-[15px] text-slate-900"
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Goal amount</Text>
          <View className="flex-row items-center rounded-xl border border-slate-200 px-4 py-3.5">
            <Text className="text-[15px] font-medium text-slate-400">Rp</Text>
            <TextInput
              value={formatRupiahInput(goalDigits)}
              onChangeText={handleGoalChange}
              placeholder="0"
              placeholderTextColor={colors.neutral400}
              keyboardType="number-pad"
              className="ml-2 flex-1 text-[15px] text-slate-900"
            />
          </View>
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <Button label="Save changes" variant="primary" disabled={!isValid} onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}
