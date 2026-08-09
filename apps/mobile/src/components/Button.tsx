import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mirrors the Button/Primary and Withdraw (secondary) components from the
// Figma file — pill-shaped, brand-700 fill for primary, outlined for
// secondary. `danger` reuses secondary's outline shape (still a low-emphasis
// shape, since logging out isn't a destroy-data action) with red text/border
// instead of slate, so it reads as "be aware" without matching the alarm
// level of a real destructive action. `disabled` drives a real Pressable
// disabled state (not just a faded look) plus an animated opacity fade — a
// hard opacity snap on every re-render reads as a flicker, especially on
// screens where the disabled condition can flip more than once in quick
// succession (e.g. email validity toggling while autofill is still
// inserting text).
//
// Visual styling (fill/border/radius/padding) lives on a plain inner `View`,
// not on `AnimatedPressable` itself. `Animated.createAnimatedComponent`
// wraps the component in a layer that, in at least one render path this
// app has been tested against, doesn't process a NativeWind `className` the
// same way a plain host component does — every button rendered with the fill
// classes directly on the animated wrapper came out backgroundless and
// borderless (invisible on white, e.g. the Welcome screen's "Get Started").
// Keeping `AnimatedPressable` purely as a touch target + opacity driver, and
// pushing every visible style onto a non-animated child, sidesteps that
// failure mode regardless of whether it's real on-device or specific to one
// toolchain — it's a strictly safer place to put styling either way.
export default function Button({ label, onPress, variant = "primary", disabled = false, className = "" }: ButtonProps) {
  const opacity = useRef(new Animated.Value(disabled ? 0.4 : 1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: disabled ? 0.4 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [disabled, opacity]);

  const containerClass =
    variant === "primary"
      ? "bg-brand-700"
      : variant === "danger"
        ? "bg-white border border-red-200"
        : "bg-white border border-slate-200";
  const labelClass = variant === "primary" ? "text-white" : variant === "danger" ? "text-red-600" : "text-slate-700";

  return (
    <AnimatedPressable onPress={onPress} disabled={disabled} style={{ opacity }} className={className}>
      <View className={`items-center justify-center rounded-full px-6 py-3.5 ${containerClass}`}>
        <Text className={`text-label font-semibold ${labelClass}`}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}
