import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { IconChevronLeft } from "./icons";

type ComingSoonProps = {
  title: string;
  icon: React.ReactNode;
  message: string;
};

// Placeholder for tabs whose real screens haven't been built yet (mirrors
// the stub-module pattern used in apps/api/internal — a real screen swaps
// in here once there's something to show). Includes a back button since
// these are pushed onto the flat stack (no BottomNav on this screen, and
// no swipe/hardware back on the web build) — without it there'd be no way
// off the screen.
export default function ComingSoon({ title, icon, message }: ComingSoonProps) {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center px-10">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">{icon}</View>
        <Text className="pt-4 text-xl font-semibold text-slate-900">{title}</Text>
        <Text className="pt-2 text-center text-[13px] text-slate-500">{message}</Text>
        <Text className="pt-1 text-center text-[13px] text-slate-500" style={{ color: colors.neutral400 }}>
          Coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
