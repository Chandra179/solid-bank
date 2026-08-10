import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconCard, IconGrid, IconHome, IconProfile } from "./icons";
import { t } from "../i18n";

export type NavKey = "home" | "pockets" | "cards" | "profile";

type BottomNavProps = {
  active: NavKey;
  onChange?: (key: NavKey) => void;
};

function getItems(): { key: NavKey; label: string; Icon: typeof IconHome }[] {
  return [
    { key: "home", label: t("nav.home"), Icon: IconHome },
    { key: "pockets", label: t("nav.pockets"), Icon: IconGrid },
    { key: "cards", label: t("nav.cards"), Icon: IconCard },
    { key: "profile", label: t("nav.profile"), Icon: IconProfile },
  ];
}

// Presentational bottom bar matching the Figma BottomNavItem row. Not wired
// to @react-navigation/bottom-tabs (not in package.json) — swap this out
// for a real bottom tab navigator if/when that dependency gets added; all
// four tabs (Home, Pockets, Cards, Profile) have real destinations now.
export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <View className="flex-row justify-between border-t border-slate-200 bg-white px-8 pb-6 pt-3">
      {getItems().map(({ key, label, Icon }) => {
        const isActive = key === active;
        const color = isActive ? colors.brand700 : colors.neutral400;
        return (
          <Pressable
            key={key}
            onPress={() => onChange?.(key)}
            accessibilityLabel={label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className="items-center"
            style={{ gap: 4 }}
          >
            <Icon size={22} color={color} />
            <Text className="text-caption font-medium" style={{ color }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}