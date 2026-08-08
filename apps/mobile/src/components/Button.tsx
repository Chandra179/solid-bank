import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
};

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
    // The opacity animation lives on a plain Animated.View wrapper rather
    // than on the Pressable itself: Animated.createAnimatedComponent(Pressable)
    // produces a component NativeWind doesn't know to intercept for
    // className (it only auto-patches core RN primitives, not ad-hoc
    // wrappers around them) — className is silently ignored on the web
    // build, leaving the button as bare unstyled text with no background,
    // padding, or rounding.
    <Animated.View style={{ opacity }}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`items-center justify-center rounded-full px-6 py-3.5 ${containerClass} ${className}`}
      >
        <Text className={`text-[15px] font-semibold ${labelClass}`}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}
