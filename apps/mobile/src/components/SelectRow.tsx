import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconChevronRight } from "./icons";

type SelectRowProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

// Generic "pick one of these" row: icon avatar, title + subtitle, chevron.
// Used for the beneficiary list (Transfer) and funding-source list (Top Up)
// so both flows share one visual pattern instead of two bespoke lists.
export default function SelectRow({ title, subtitle, icon, onPress }: SelectRowProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-2" style={{ gap: 12 }}>
      <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">{icon}</View>
      <View className="flex-1" style={{ gap: 2 }}>
        <Text className="text-label font-semibold text-slate-900" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text className="text-caption text-slate-500">{subtitle}</Text> : null}
      </View>
      <IconChevronRight size={16} color={colors.neutral400} />
    </Pressable>
  );
}
