import React from "react";
import { Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

// Mirrors the Button/Primary and Withdraw (secondary) components from the
// Figma file — pill-shaped, brand-700 fill for primary, outlined for
// secondary. Keep new button variants here rather than one-off styling
// inline in screens.
export default function Button({ label, onPress, variant = "primary", className = "" }: ButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center rounded-full px-6 py-3.5 ${
        isPrimary ? "bg-brand-700" : "bg-white border border-slate-200"
      } ${className}`}
    >
      <Text className={`text-[15px] font-semibold ${isPrimary ? "text-white" : "text-slate-700"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
