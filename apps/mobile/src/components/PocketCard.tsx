import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconPocket } from "./icons";
import type { Pocket } from "@/data";

export type { Pocket };

type PocketCardProps = {
  pocket: Pocket;
  onPress?: () => void;
};

function formatIDR(minor: number) {
  // amounts are stored as integer minor units (sen) per the ledger's
  // convention (see apps/api/internal/ledger) — divide by 100 before display.
  return `Rp ${Math.round(minor / 100).toLocaleString("id-ID")}`;
}

// Matches the PocketCard component in Figma: icon + name header, progress
// bar, "saved of target" caption. Width is fixed so a row of these scrolls
// horizontally, same as the design.
export default function PocketCard({ pocket, onPress }: PocketCardProps) {
  const pct = pocket.targetMinor > 0 ? Math.min(1, pocket.savedMinor / pocket.targetMinor) : 0;
  return (
    <Pressable
      onPress={onPress}
      className="w-[180px] rounded-2xl border border-slate-200 bg-white p-4"
      style={{ gap: 12 }}
    >
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
          <IconPocket size={18} color={colors.brand700} />
        </View>
        <Text className="flex-1 text-[13px] font-semibold text-slate-900" numberOfLines={1}>
          {pocket.name}
        </Text>
      </View>
      <View className="h-1.5 rounded-full bg-slate-100">
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${pct * 100}%`, backgroundColor: colors.success500 }}
        />
      </View>
      <Text className="text-[11px] text-slate-500">
        {formatIDR(pocket.savedMinor)} of {formatIDR(pocket.targetMinor)}
      </Text>
    </Pressable>
  );
}
