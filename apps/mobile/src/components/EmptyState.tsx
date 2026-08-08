import React from "react";
import { Text, View } from "react-native";
import Button from "./Button";

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

// One shared "nothing here yet" pattern (icon + headline + one-liner +
// optional CTA) reused across every list in the app — no pockets, no
// transactions, no beneficiaries, no search results — so an empty screen
// reads as a deliberate state, not a bug. Kept deliberately calm (no
// illustration, no color) since this shows up mid-flow, not as a rare edge
// case — first-time users see the pockets/transactions empty states by
// default before they've done anything.
export default function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center px-8 py-10" style={{ gap: 12 }}>
      <View className="h-14 w-14 items-center justify-center rounded-full bg-slate-100">{icon}</View>
      <View className="items-center" style={{ gap: 4 }}>
        <Text className="text-[15px] font-semibold text-slate-900">{title}</Text>
        <Text className="text-center text-[13px] text-slate-500">{subtitle}</Text>
      </View>
      {actionLabel ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} className="mt-2" />
      ) : null}
    </View>
  );
}
