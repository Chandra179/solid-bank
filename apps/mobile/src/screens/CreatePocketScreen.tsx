import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconPocket, IconCheck } from "../components/icons";
import Button from "../components/Button";
import { addPocket } from "@/data";
import { useInvalidateData } from "@/data/queries";
import { parseDateInput } from "@/utils/dateInput";

type Props = NativeStackScreenProps<RootStackParamList, "CreatePocket">;

function formatRupiahInput(digits: string) {
  const n = digits === "" ? 0 : parseInt(digits, 10);
  return n > 0 ? n.toLocaleString("id-ID") : "";
}

// Real destination behind every "Create a pocket" empty-state CTA (Home,
// Pockets) plus the standing "+" in the Pockets header — previously all of
// these either had no onAction at all or, on Pockets, were unreachable
// outright, since the mock data always seeds 3 pockets so the empty state
// never actually renders. A normal text-form screen (name + TextInput,
// like ProfileSetupScreen) rather than the numeric-keypad pattern
// (AmountEntryScreen) since this is "describe a goal," not "enter an
// amount to move right now" — the goal field still only accepts digits,
// but doesn't need the full keypad ceremony for a one-off, rarely-changed
// number.
export default function CreatePocketScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [goalDigits, setGoalDigits] = useState("");
  const [targetDateText, setTargetDateText] = useState("");
  // Shared/group pockets — split a goal with other freelancers/collaborators
  // (see data/types.ts's Pocket.participants for why this is mock/display
  // data rather than a real multi-user backend). Off by default so the
  // common case (a solo goal) stays a two-field form.
  const [shared, setShared] = useState(false);
  const [participantNames, setParticipantNames] = useState<string[]>([]);
  const [participantInput, setParticipantInput] = useState("");
  const invalidate = useInvalidateData();

  const goalRupiah = goalDigits === "" ? 0 : parseInt(goalDigits, 10);
  // Optional field: empty is always fine (a pocket with no deadline just
  // skips pacing — see utils/pocketPacing.ts). Anything typed has to parse
  // to a real, future calendar date, though — a target date that's
  // unparseable or already in the past isn't a goal deadline a user could
  // have meant.
  const targetDateMinor = targetDateText.trim() === "" ? undefined : parseDateInput(targetDateText);
  const targetDateError =
    targetDateText.trim() !== "" && (targetDateMinor === undefined || targetDateMinor <= Date.now());
  const isValid = name.trim().length > 1 && goalRupiah > 0 && !targetDateError;

  function handleGoalChange(text: string) {
    // Strip everything but digits so pasted "Rp 5.000.000"-style input
    // still works, and cap length the same way AmountEntryScreen does to
    // guard against an unbounded string turning into Infinity/overflow.
    setGoalDigits(text.replace(/\D/g, "").slice(0, 12));
  }

  function handleCreate() {
    if (!isValid) return;
    const pocket = addPocket(name.trim(), goalRupiah * 100, targetDateMinor, shared ? participantNames : undefined);
    invalidate();
    // replace, not navigate — stepping back from the new pocket's detail
    // screen should land on the list it was created from, not back on a
    // blank creation form.
    navigation.replace("PocketDetail", { pocketId: pocket.id });
  }

  function addParticipant() {
    const trimmed = participantInput.trim();
    if (!trimmed || participantNames.includes(trimmed)) return;
    setParticipantNames((prev) => [...prev, trimmed]);
    setParticipantInput("");
  }
  function removeParticipant(nameToRemove: string) {
    setParticipantNames((prev) => prev.filter((n) => n !== nameToRemove));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <View className="items-center px-6 pt-2" style={{ gap: 8 }}>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          {/* size 22, not 24 — matches every other IconPocket in an h-14
              w-14 badge (Home/Transfer's quick-action, EditPocketScreen)
              per docs/conventions.md's icon-to-badge sizing note. */}
          <IconPocket size={22} color={colors.brand700} />
        </View>
        <Text className="text-2xl font-semibold text-slate-900">New pocket</Text>
        <Text className="text-center text-body text-slate-500">
          Give it a name and a goal — you can add money to it right away.
        </Text>
      </View>

      <View className="px-6 pt-8" style={{ gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text className="text-body font-semibold text-slate-700">Pocket name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. New Phone"
            placeholderTextColor={colors.neutral500}
            maxLength={40}
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-body font-semibold text-slate-700">Goal amount</Text>
          <View className="flex-row items-center rounded-xl border border-slate-200 px-4 py-3.5">
            <Text className="text-label font-medium text-slate-400">Rp</Text>
            <TextInput
              value={formatRupiahInput(goalDigits)}
              onChangeText={handleGoalChange}
              placeholder="0"
              placeholderTextColor={colors.neutral500}
              keyboardType="number-pad"
              className="ml-2 flex-1 text-label text-slate-900"
            />
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-body font-semibold text-slate-700">Target date (optional)</Text>
          <TextInput
            value={targetDateText}
            onChangeText={setTargetDateText}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.neutral500}
            maxLength={10}
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
          {targetDateError ? (
            <Text className="text-caption font-medium text-red-600">
              Enter a real future date as YYYY-MM-DD, or leave this blank.
            </Text>
          ) : (
            <Text className="text-caption text-slate-500">
              Leave blank to skip pacing — with a date, this pocket's progress bar shows whether you're on
              track.
            </Text>
          )}
        </View>

        {/* Shared/group pockets — splitting a goal with other freelancers
            or collaborators (a co-working membership, a joint project
            buffer) rather than saving solo. */}
        <View style={{ gap: 6 }}>
          <Pressable
            onPress={() => setShared((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: shared }}
            className="flex-row items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5"
          >
            <View style={{ gap: 2 }}>
              <Text className="text-label font-semibold text-slate-700">Split with others</Text>
              <Text className="text-caption text-slate-500">Everyone's contributions count toward the goal.</Text>
            </View>
            <View
              className="h-6 w-6 items-center justify-center rounded-md border"
              style={{
                backgroundColor: shared ? colors.brand700 : colors.neutral0,
                borderColor: shared ? colors.brand700 : colors.neutral200,
              }}
            >
              {shared ? <IconCheck size={14} color={colors.neutral0} /> : null}
            </View>
          </Pressable>

          {shared ? (
            <View style={{ gap: 8 }}>
              <View className="flex-row items-center rounded-xl border border-slate-200 px-4 py-2" style={{ gap: 8 }}>
                <TextInput
                  value={participantInput}
                  onChangeText={setParticipantInput}
                  placeholder="Add a name"
                  placeholderTextColor={colors.neutral500}
                  maxLength={30}
                  onSubmitEditing={addParticipant}
                  className="flex-1 py-1.5 text-label text-slate-900"
                />
                <Pressable onPress={addParticipant} className="rounded-full bg-slate-100 px-3 py-1.5">
                  <Text className="text-caption font-semibold text-slate-700">Add</Text>
                </Pressable>
              </View>
              {participantNames.length > 0 ? (
                <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                  {participantNames.map((n) => (
                    <Pressable
                      key={n}
                      onPress={() => removeParticipant(n)}
                      className="flex-row items-center rounded-full bg-brand-50 px-3 py-1.5"
                      style={{ gap: 6 }}
                    >
                      <Text className="text-caption font-semibold text-brand-700">{n}</Text>
                      <Text className="text-caption font-semibold text-brand-700">×</Text>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text className="text-caption text-slate-500">
                  Add each person you're splitting this goal with.
                </Text>
              )}
            </View>
          ) : null}
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <Button label="Create pocket" variant="primary" disabled={!isValid} onPress={handleCreate} />
      </View>
    </SafeAreaView>
  );
}
