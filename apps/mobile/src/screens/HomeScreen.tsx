import React from "react";
import { View, Text } from "react-native";

// This screen is a placeholder proving the RN + TypeScript + NativeWind
// wiring works end to end. Replace with the real accounts/dashboard screen.
export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-semibold text-brand-700">
        Digital Bank
      </Text>
      <Text className="mt-2 text-base text-gray-500">
        App shell is wired up — build the real screens here.
      </Text>
    </View>
  );
}
