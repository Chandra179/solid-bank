import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconPlus, IconPocket } from "../components/icons";
import PocketCard from "../components/PocketCard";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import { listPockets } from "@/data";

type Props = NativeStackScreenProps<RootStackParamList, "Pockets">;

// Real destination for BottomNav's "Pockets" tab (and Home's "Pockets"
// quick action / "See all" link) — previously all three either did nothing
// or jumped straight to a single pocket's detail screen because this list
// didn't exist yet. The data (listPockets) and detail screen were already
// built for Home's horizontal row; this just gives that same data a
// full, dedicated list view.
export default function PocketsScreen({ navigation }: Props) {
  const pockets = listPockets();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Text className="text-2xl font-semibold text-slate-900">Pockets</Text>
        <Pressable
          onPress={() => navigation.navigate("CreatePocket")}
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconPlus size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 8 }}>
        {pockets.length === 0 ? (
          <EmptyState
            icon={<IconPocket size={22} color={colors.neutral500} />}
            title="No pockets yet"
            subtitle="Create a pocket to start saving toward a goal."
            actionLabel="Create a pocket"
            onAction={() => navigation.navigate("CreatePocket")}
          />
        ) : (
          <View className="px-6 pt-2" style={{ gap: 12 }}>
            {pockets.map((pocket) => (
              <PocketCard
                key={pocket.id}
                pocket={pocket}
                variant="full"
                onPress={() => navigation.navigate("PocketDetail", { pocketId: pocket.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNav
        active="pockets"
        onChange={(key) => {
          if (key === "home") navigation.navigate("Home");
          if (key === "cards") navigation.navigate("Cards");
          if (key === "profile") navigation.navigate("Profile");
        }}
      />
    </SafeAreaView>
  );
}
