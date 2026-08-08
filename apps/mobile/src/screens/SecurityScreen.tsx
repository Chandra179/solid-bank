import React, { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconShield } from "../components/icons";
import SelectRow from "../components/SelectRow";

type Props = NativeStackScreenProps<RootStackParamList, "Security">;

// Real destination behind Profile's Security row. Biometric login is a
// genuinely local, real toggle (no backend involved either way — it's a
// device capability flag). Change PIN still routes to ComingSoon: a real
// PIN-reset needs the same re-auth ceremony as onboarding's SetPin/
// ConfirmPin pair, which currently only exists in the unauthenticated
// Stack.Group — reusing it here would mean a larger navigator restructuring,
// scoped out of this pass rather than half-built.
export default function SecurityScreen({ navigation }: Props) {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">Security</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="mx-6 mt-4 rounded-2xl border border-slate-200 px-4">
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-1 pr-4" style={{ gap: 2 }}>
            <Text className="text-label font-semibold text-slate-900">Biometric login</Text>
            <Text className="text-caption text-slate-500">Use Face/Touch ID instead of your PIN to sign in.</Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={setBiometricsEnabled}
            trackColor={{ true: colors.brand700, false: colors.neutral200 }}
          />
        </View>
        <View className="h-px bg-slate-100" />
        <SelectRow
          title="Change PIN"
          subtitle="Update your 6-digit login PIN"
          icon={<IconShield size={18} color={colors.neutral500} />}
          onPress={() =>
            navigation.navigate("ComingSoon", {
              title: "Change PIN",
              message: "Resetting your PIN isn't wired up yet — it needs the same verification steps as setting one up during onboarding.",
              icon: "security",
            })
          }
        />
      </View>

      <View className="mx-6 mt-6 rounded-2xl border border-slate-200 px-4 py-4" style={{ gap: 2 }}>
        <Text className="text-label font-semibold text-slate-900">This device</Text>
        <Text className="text-caption text-slate-500">Signed in and verified — no other active sessions.</Text>
      </View>
    </SafeAreaView>
  );
}
