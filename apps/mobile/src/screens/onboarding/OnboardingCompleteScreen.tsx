import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme/colors";
import { IconCheck } from "../../components/icons";
import Button from "../../components/Button";
import { useSessionStore } from "../../store/session";

// Last screen of onboarding. Tapping through here is what actually flips
// useSessionStore's isAuthenticated flag — App.tsx watches that flag to
// switch the whole navigator from the onboarding screen group to the main
// app group (see the RootNavigator split in App.tsx), so this button is
// the one place that transition happens. No navigation.navigate() call is
// needed here: once isAuthenticated flips, React Navigation swaps the
// available screens and mounts Home on its own.
export default function OnboardingCompleteScreen() {
  const setUser = useSessionStore((s) => s.setUser);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-6" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center" style={{ gap: 16 }}>
        <View className="h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <IconCheck size={28} color={colors.success500} />
        </View>
        <Text className="text-xl font-semibold text-slate-900">You're all set</Text>
        <Text className="max-w-[280px] text-center text-[13px] text-slate-500">
          Your account is ready. Full limits unlock once identity verification finishes — we'll notify you.
        </Text>
      </View>

      <View className="w-full pb-4">
        <Button label="Start Banking" variant="primary" onPress={() => setUser("demo-user")} />
      </View>
    </SafeAreaView>
  );
}
