import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconChevronRight } from "./icons";

type SelectRowProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress?: () => void;
  // For rows that are genuinely not selectable right now (e.g. a frozen
  // card as a top-up source) rather than just visually de-emphasized —
  // swaps the chevron for a small badge and drops the press handler
  // instead of leaving a row that looks tappable but silently does nothing.
  disabled?: boolean;
  disabledLabel?: string;
};

// Generic "pick one of these" row: icon avatar, title + subtitle, chevron.
// Used for the beneficiary list (Transfer) and funding-source list (Top Up)
// so both flows share one visual pattern instead of two bespoke lists.
export default function SelectRow({ title, subtitle, icon, onPress, disabled = false, disabledLabel }: SelectRowProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className="flex-row items-center py-2"
      style={{ gap: 12, opacity: disabled ? 0.5 : 1 }}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">{icon}</View>
      <View className="flex-1" style={{ gap: 2 }}>
        <Text className="text-label font-semibold text-slate-900" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text className="text-caption text-slate-500">{subtitle}</Text> : null}
      </View>
      {disabled ? (
        <Text className="text-caption font-semibold text-slate-400">{disabledLabel ?? "Unavailable"}</Text>
      ) : (
        <IconChevronRight size={16} color={colors.neutral400} />
      )}
    </Pressable>
  );
}