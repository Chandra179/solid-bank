import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../../theme/colors";
import { IconChevronLeft } from "../../components/icons";
import Button from "../../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileSetup">;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// First "normal text form" screen in the flow — deliberate contrast with
// the numeric-keypad screens on either side of it (phone/OTP before,
// KTP/selfie after). Signals a mode shift: "now we're collecting who you
// are," not "now we're verifying you."
export default function ProfileSetupScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const isValid = name.trim().length > 1 && EMAIL_RE.test(email);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">A few details</Text>
        <Text className="text-body text-slate-500">This should match your KTP — we'll check it in a moment.</Text>
      </View>

      <View className="px-6 pt-8" style={{ gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text className="text-body font-semibold text-slate-700">Full name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="As shown on your KTP"
            placeholderTextColor={colors.neutral400}
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text className="text-body font-semibold text-slate-700">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.neutral400}
            autoCapitalize="none"
            keyboardType="email-address"
            className="rounded-xl border border-slate-200 px-4 py-3.5 text-label text-slate-900"
          />
        </View>
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <Button label="Continue" variant="primary" disabled={!isValid} onPress={() => navigation.navigate("KtpScan")} />
      </View>
    </SafeAreaView>
  );
}
