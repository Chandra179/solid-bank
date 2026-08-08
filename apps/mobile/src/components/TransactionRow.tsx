import React from "react";
import { Text, View } from "react-native";
import { colors } from "../theme/colors";

export type Transaction = {
  id: string;
  name: string;
  dateLabel: string;
  amountMinor: number; // positive = incoming/credit, negative = outgoing/debit
  icon: React.ReactNode;
};

function formatSignedIDR(minor: number) {
  const sign = minor < 0 ? "-" : "+";
  return `${sign}Rp ${Math.round(Math.abs(minor) / 100).toLocaleString("id-ID")}`;
}

// One row in a transaction list — icon avatar, name + date, signed amount
// (green for incoming). Matches the TransactionRow component in Figma and
// is reused on both the Home screen and the per-pocket history screen.
export default function TransactionRow({ name, dateLabel, amountMinor, icon }: Transaction) {
  const incoming = amountMinor > 0;
  return (
    <View className="flex-row items-center py-2" style={{ gap: 12 }}>
      <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
        {icon}
      </View>
      <View className="flex-1" style={{ gap: 2 }}>
        <Text className="text-[13px] font-semibold text-slate-900" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-[11px] text-slate-500">{dateLabel}</Text>
      </View>
      <Text
        className="text-[13px] font-semibold"
        style={{ color: incoming ? colors.success500 : colors.neutral900 }}
      >
        {formatSignedIDR(amountMinor)}
      </Text>
    </View>
  );
}
