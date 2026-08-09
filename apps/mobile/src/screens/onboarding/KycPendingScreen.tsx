import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../../theme/colors";
import { IconShield } from "../../components/icons";
import Button from "../../components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "KycPending">;

// Represents accounts.status = 'pending_kyc' from apps/api/migrations/
// 0001_init.sql honestly instead of pretending verification is instant —
// real KTP/Dukcapil checks take time. Deliberately doesn't block the rest
// of onboarding: real neobanks let you finish setup (set a PIN, see the
// app) while verification runs in the background, then unlock full limits
// once status flips to 'active'. That's why "Continue" moves forward
// rather than making the user wait on this screen.
export default function KycPendingScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-6" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center" style={{ gap: 16 }}>
        <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <IconShield size={28} color={colors.brand700} />
        </View>
        <Text className="text-xl font-semibold text-slate-900">Verifying your identity</Text>
        <Text className="max-w-[280px] text-center text-body text-slate-500">
          This usually takes a few minutes. We'll let you know once it's done — you can finish setting up your
          account in the meantime.
        </Text>
      </View>

      <View className="w-full pb-4">
        <Button label="Continue" variant="primary" onPress={() => navigation.navigate("SetPin")} />
      </View>
    </SafeAreaView>
  );
}
