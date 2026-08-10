import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconBackspace } from "./icons";

type NumericKeypadProps = {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
};

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "back"],
];

// Custom numeric keypad for money-entry screens — deliberately not the
// native keyboard. A dedicated keypad avoids autocorrect/locale keyboard
// inconsistencies, lets every key be a large easy target, and keeps the
// amount display always in view above it (the native keyboard can push
// content around depending on device/OS).
export default function NumericKeypad({ onDigit, onBackspace }: NumericKeypadProps) {
  return (
    <View style={{ gap: 12 }}>
      {ROWS.map((row, i) => (
        <View key={i} className="flex-row justify-between">
          {row.map((key, j) => {
            if (key === "") return <View key={j} className="h-16 w-20" />;
            if (key === "back") {
              return (
                <Pressable
                  key={j}
                  onPress={onBackspace}
                  accessibilityLabel="Delete"
                  accessibilityRole="button"
                  className="h-16 w-20 items-center justify-center"
                >
                  <IconBackspace size={22} color={colors.neutral700} />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={j}
                onPress={() => onDigit(key)}
                accessibilityLabel={key}
                accessibilityRole="button"
                className="h-16 w-20 items-center justify-center rounded-2xl active:bg-slate-100"
              >
                <Text className="text-2xl font-semibold text-slate-900">{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
