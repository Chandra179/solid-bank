import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type QuickActionProps = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  // Every current call site sits on the brand-700 balance card, so this
  // used to be hardcoded white — silently unusable anywhere else. Now a
  // real (overridable) prop instead of a baked-in assumption.
  labelColor?: string;
};

// The four circular shortcuts on the balance card (Top Up / Transfer /
// Pockets / More) — maps 1:1 to the QuickAction component in Figma.
export default function QuickAction({ label, icon, onPress, labelColor = colors.neutral0 }: QuickActionProps) {
  return (
    <Pressable onPress={onPress} className="items-center" style={{ gap: spacing.xs }}>
      <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-white">
        {icon}
      </View>
      <Text className="text-caption font-medium" style={{ color: labelColor }}>
        {label}
      </Text>
    </Pressable>
  );
}
