import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconPocket } from "../components/icons";
import Button from "../components/Button";
import { getPocket, listPockets, updatePocket } from "@/data";
import { useInvalidateData } from "@/data/queries";
import { formatDateInput, parseDateInput } from "@/utils/dateInput";

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
//
// Also owns turning auto-save on/off (a weekly recurring amount) — this is
// the one field on Pocket where 0/empty has a real meaning ("off"), unlike
// name/goal which are always required, so it's validated separately from
// `isValid` rather than blocking Save if it's blank.
export default function EditPocketScreen({ navigation, route }: Props) {
  const pocket = getPocket(route.params.pocketId) ?? listPockets()[0];
  const [name, setName] = useState(pocket.name);
  const [goalDigits, setGoalDigits] = useState(String(Math.floor(pocket.targetMinor / 100)));
  const [autoSaveDigits, setAutoSaveDigits] = useState(
    pocket.autoSaveMinor ? String(Math.floor(pocket.autoSaveMinor / 100)) : ""
  );
  const [targetDateText, setTargetDateText] = useState(pocket.targetDate ? formatDateInput(pocket.targetDate) : "");
  const invalidate = useInvalidateData();

  const goalRupiah = goalDigits === "" ? 0 : parseInt(goalDigits, 10);
  const autoSaveRupiah = autoSaveDigits === "" ? 0 : parseInt(autoSaveDigits, 10);
  // Same validation as CreatePocketScreen: blank is fine (clears/skips a
  // target date), anything typed has to be a real future date. Unlike
  // Create, a date already in the past can legitimately exist here (a
  // pocket whose deadline came and went while underfunded — the "overdue"
  // pace state) — that's only a validation error for a *newly typed* value,
  // not for whatever was already saved before this screen opened.
  const targetDateMinor = targetDateText.trim() === "" ? undefined : parseDateInput(targetDateText);
  const targetDateChanged = targetDateText.trim() !== (pocket.targetDate ? formatDateInput(pocket.targetDate) : "");
  const targetDateError = targetDateText.trim() !== "" && targetDateMinor === undefined;
  const isValid = name.trim().length > 1 && goalRupiah > 0 && !targetDateError;

  function handleGoalChange(text: string) {
    setGoalDigits(text.replace(/\D/g, "").slice(0, 12));
  }
  function handleAutoSaveChange(text: string) {
    setAutoSaveDigits(text.replace(/\D/g, "").slice(0, 12));
  }

  function handleSave() {
    if (!isValid) return;
    updatePocket(pocket.id, {
      name: name.trim(),
      targetMinor: goalRupiah * 100,
      autoSaveMinor: autoSaveRupiah * 100,
      // updatePocket's targetDate: undefined means "leave it alone"; null
      // means "clear it" (see mockPockets.ts) — only send a value at all
      // when this field actually changed, and send null specifically when
      // it was cleared out rather than left blank from the start.
      ...(targetDateChanged ? { targetDate: targetDateMinor ?? null } : {}),
    });
    invalidate();
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
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Goal amount</Text>
          <View className="flex-row items-center rounded-xl border border-slate-200 px-4 py-3.5">
            <Text className="text-label font-medium text-slate-400">Rp</Text>
            <TextInput
              value={formatRupiahInput(goalDigits)}
              onChangeText={handleGoalChange}
              placeholder="0"
              placeholderTextColor={colors.neutral400}
              keyboardType="number-pad"
              className="ml-2 flex-1 text-label text-slate-900"
            />
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Weekly auto-save (optional)</Text>
          <View className="flex-row items-center rounded-xl border border-slate-200 px-4 py-3.5">
            <Text className="text-label font-medium text-slate-400">Rp</Text>
            <TextInput
              value={formatRupiahInput(autoSaveDigits)}
              onChangeText={handleAutoSaveChange}
              placeholder="Off"
              placeholderTextColor={colors.neutral400}
              keyboardType="number-pad"
              className="ml-2 flex-1 text-label text-slate-900"
            />
          </View>
          <Text className="text-caption text-slate-500">
            Leave at 0 to turn auto-save off. There's no real weekly job yet — PocketDetail's
            "Boost now" applies one week's worth on demand instead.
          </Text>
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-label font-semibold text-slate-700">Target date (optional)</Text>
          <TextInput
            value={targetDateText}
            onChangeText={setTargetDateText}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.neutral400}
            maxLength={10}
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
          {targetDateError ? (
            <Text className="text-caption font-medium text-red-600">
              Enter a real date as YYYY-MM-DD, or clear this field.
            </Text>
          ) : (
            <Text className="text-caption text-slate-500">
              Clear this to turn off pacing for this pocket.
            </Text>
          )}
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <Button label="Save changes" variant="primary" disabled={!isValid} onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}
