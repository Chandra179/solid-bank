import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconCard, IconGrid, IconHome, IconProfile } from "./icons";

export type NavKey = "home" | "pockets" | "cards" | "profile";

type BottomNavProps = {
  active: NavKey;
  onChange?: (key: NavKey) => void;
};

const ITEMS: { key: NavKey; label: string; Icon: typeof IconHome }[] = [
  { key: "home", label: "Home", Icon: IconHome },
  { key: "pockets", label: "Pockets", Icon: IconGrid },
  { key: "cards", label: "Cards", Icon: IconCard },
  { key: "profile", label: "Profile", Icon: IconProfile },
];

// Presentational bottom bar matching the Figma BottomNavItem row. Not wired
// to @react-navigation/bottom-tabs (not in package.json) — swap this out
// for a real bottom tab navigator once there's more than one tab-level
// screen worth switching between (Home and Profile currently; Cards is
// still a placeholder tab with no destination).
export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <View className="flex-row justify-between border-t border-slate-200 bg-white px-8 pb-6 pt-3">
      {ITEMS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        const color = isActive ? colors.brand700 : colors.neutral400;
        return (
          <Pressable key={key} onPress={() => onChange?.(key)} className="items-center" style={{ gap: 4 }}>
            <Icon size={22} color={color} />
            <Text className="text-[11px] font-medium" style={{ color }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
