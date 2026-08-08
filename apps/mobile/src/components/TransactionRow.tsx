import React from "react";
import { Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { formatSignedIDR } from "@/utils/currency";
import type { Transaction as TransactionData } from "@/data";

// Data shape (id/name/dateLabel/amountMinor) comes from @/data — `icon` is
// added here because which icon a row renders is a presentation decision
// made at the call site (Home picks incoming/outgoing icons one way,
// PocketDetail picks a slightly different pair), not something the data
// layer should know about.
export type Transaction = TransactionData & { icon: React.ReactNode };

// One row in a transaction list — icon avatar, name + date, signed amount
// (green for incoming). Matches the TransactionRow component in Figma and
// is reused on both the Home screen and the per-pocket history screen.
export default function TransactionRow({ name, dateLabel, amountMinor, icon }: Transaction) {
  const incoming = amountMinor > 0;
  return (
    <View className="flex-row items-center py-2" style={{ gap: spacing.md }}>
      <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
        {icon}
      </View>
      <View className="flex-1" style={{ gap: 2 }}>
        <Text className="text-body font-semibold text-slate-900" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-caption text-slate-500">{dateLabel}</Text>
      </View>
      <Text
        className="text-body font-semibold"
        style={{ color: incoming ? colors.success500 : colors.neutral900 }}
      >
        {formatSignedIDR(amountMinor)}
      </Text>
    </View>
  );
}
