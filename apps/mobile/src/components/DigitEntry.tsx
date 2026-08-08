import React from "react";
import { View } from "react-native";
import { Text } from "react-native";

type DigitEntryProps = {
  length: number;
  value: string;
  masked?: boolean; // true for PIN (filled dot only, never shows the digit) vs OTP (shows the digit)
};

// Shared "N boxes, fill as you type" pattern behind both OtpScreen and the
// PIN screens. Deliberately paired with NumericKeypad rather than a native
// text input in all three places — same reasoning as AmountEntryScreen:
// consistent large tap targets, no autocorrect/keyboard-locale surprises,
// and it visually ties the whole onboarding flow together as one system.
//
// Boxes are flex-sized (not a fixed pixel width) so a 6-box row doesn't
// overflow the 24px screen margins on a 320px-wide device (iPhone SE
// 1st-gen width) — 6 fixed 44px boxes + gaps would (314px needed vs 272px
// available). `maxWidth` caps growth on wider screens so it doesn't
// stretch too large on a tablet.
export default function DigitEntry({ length, value, masked = false }: DigitEntryProps) {
  const cells = Array.from({ length }, (_, i) => value[i]);
  return (
    <View className="w-full flex-row justify-center" style={{ gap: 10 }}>
      {cells.map((d, i) => {
        const filled = d !== undefined;
        return (
          <View
            key={i}
            style={{ flex: 1, maxWidth: 48, aspectRatio: 0.8 }}
            className={`items-center justify-center rounded-xl border ${
              filled ? "border-brand-700 bg-brand-50" : "border-slate-200 bg-white"
            }`}
          >
            {filled ? (
              masked ? (
                <View className="h-2.5 w-2.5 rounded-full bg-brand-700" />
              ) : (
                <Text className="text-xl font-semibold text-slate-900">{d}</Text>
              )
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
