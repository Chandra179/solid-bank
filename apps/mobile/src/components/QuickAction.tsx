import React from "react";
import { Pressable, Text, View } from "react-native";

type QuickActionProps = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

// The four circular shortcuts on the balance card (Top Up / Transfer /
// Pockets / More) — maps 1:1 to the QuickAction component in Figma.
export default function QuickAction({ label, icon, onPress }: QuickActionProps) {
  return (
    <Pressable onPress={onPress} className="items-center" style={{ gap: 8 }}>
      <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-white">
        {icon}
      </View>
      <Text className="text-[11px] font-medium text-white">{label}</Text>
    </Pressable>
  );
}
