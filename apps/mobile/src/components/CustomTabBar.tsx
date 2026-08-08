import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "../theme/colors";

// Fully custom tab bar UI, rendered via Tab.Navigator's `tabBar` prop.
// react-navigation still owns routing state, gestures, and deep-linking —
// this component only owns pixels. Per-tab icon/label come from each
// Tab.Screen's `options` (tabBarIcon / tabBarLabel / title), same as the
// default bar would read, so screens don't need to change.
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-white"
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.neutral200,
        paddingBottom: insets.bottom || 8,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        if (!descriptor) return null;
        const { options } = descriptor;
        const isFocused = state.index === index;
        const label =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
              ? options.title
              : route.name;
        const color = isFocused ? colors.brand700 : colors.neutral400;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            className="flex-1 items-center justify-center"
            style={{ gap: 4 }}
          >
            <View
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: isFocused ? colors.brand50 : "transparent" }}
            >
              {options.tabBarIcon?.({ focused: isFocused, color, size: 20 })}
            </View>
            <Text
              style={{ color, fontSize: 11, fontWeight: isFocused ? "600" : "500" }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
