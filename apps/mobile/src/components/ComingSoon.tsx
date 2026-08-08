import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

type ComingSoonProps = {
  title: string;
  icon: React.ReactNode;
  message: string;
};

// Placeholder for tabs whose real screens haven't been built yet (mirrors
// the stub-module pattern used in apps/api/internal — a real screen swaps
// in here once there's something to show).
export default function ComingSoon({ title, icon, message }: ComingSoonProps) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-10" edges={["top"]}>
      <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">{icon}</View>
      <Text className="pt-4 text-xl font-semibold text-slate-900">{title}</Text>
      <Text className="pt-2 text-center text-[13px] text-slate-500">{message}</Text>
      <Text className="pt-1 text-center text-[13px] text-slate-500" style={{ color: colors.neutral400 }}>
        Coming soon.
      </Text>
    </SafeAreaView>
  );
}
