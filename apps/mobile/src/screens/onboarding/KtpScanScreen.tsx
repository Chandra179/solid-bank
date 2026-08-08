import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";

import { colors } from "../../theme/colors";
import { IconCamera, IconCheck, IconChevronLeft } from "../../components/icons";
import Button from "../../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "KtpScan">;

// No camera library is wired up yet (no react-native-vision-camera /
// expo-camera in package.json), so this is a UI mock: a dark "viewfinder"
// with a card-shaped framing guide and a tap-to-simulate-capture button,
// not a real camera feed. Swap the dark placeholder View for an actual
// camera preview once a camera dependency is chosen — the framing overlay
// and captured/retake state below should carry over unchanged.
export default function KtpScanScreen({ navigation }: Props) {
  const [captured, setCaptured] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">Scan your KTP</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="px-6 pb-2 pt-2">
        <Text className="text-center text-[13px] text-slate-500">
          {captured ? "Make sure all four corners are visible and text is readable." : "Align your KTP within the frame."}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="aspect-[1.586] w-full items-center justify-center rounded-2xl bg-slate-900">
          {captured ? (
            <View className="h-14 w-14 items-center justify-center rounded-full bg-green-500">
              <IconCheck size={26} color={colors.neutral0} />
            </View>
          ) : (
            // Uniform inset on both axes so the guide keeps a KTP card's
            // real aspect ratio, matching the card-shaped viewfinder it
            // sits inside — an uneven inset (e.g. 92% wide / 85% tall)
            // would subtly distort the guide away from a real card shape.
            <View className="h-[88%] w-[88%] rounded-xl border-2 border-dashed border-white/60" />
          )}
        </View>
      </View>

      <View className="px-6 pb-4" style={{ gap: 12 }}>
        {captured ? (
          <>
            <Button label="Use this photo" variant="primary" onPress={() => navigation.navigate("Selfie")} />
            <Pressable onPress={() => setCaptured(false)} className="items-center py-2">
              <Text className="text-[13px] font-semibold text-slate-500">Retake</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={() => setCaptured(true)}
            className="h-16 w-16 items-center justify-center self-center rounded-full bg-brand-700"
          >
            <IconCamera size={26} color={colors.neutral0} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
