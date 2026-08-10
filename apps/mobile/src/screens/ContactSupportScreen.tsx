import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCheck, IconChevronLeft, IconHelp } from "../components/icons";
import Button from "../components/Button";
import { submitSupportMessage } from "@/data";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "ContactSupport">;

// Real destination behind Help's "Contact support" row. Not live chat —
// that needs an actual person on the other end, which is a genuinely
// separate feature and stayed a honest ComingSoon gap. This is the more
// modest thing a backend-less mock layer can make truly real: the message
// is genuinely captured (submitSupportMessage), and the person gets a
// real confirmation, not a form that silently goes nowhere.
export default function ContactSupportScreen({ navigation }: Props) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const canSend = message.trim().length > 0;

  function handleSend() {
    if (!canSend) return;
    submitSupportMessage(message.trim());
    setSent(true);
  }

  if (sent) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center" style={{ gap: 16 }}>
          <View className="h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: colors.success100 }}>
            <IconCheck size={28} color={colors.success500} />
          </View>
          <Text className="text-xl font-semibold text-slate-900">{t("contactSupport.sentTitle")}</Text>
          <Text className="max-w-[280px] text-center text-body text-slate-500">
            {t("contactSupport.sentMessage")}
          </Text>
        </View>
        <View className="w-full pb-4">
          <Button label={t("contactSupport.done")} variant="primary" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t("common.goBack")}
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">{t("contactSupport.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="items-center px-6 pt-4" style={{ gap: 8 }}>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <IconHelp size={24} color={colors.brand700} />
        </View>
        <Text className="text-center text-body text-slate-500">
          {t("contactSupport.intro")}
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder={t("contactSupport.placeholder")}
          placeholderTextColor={colors.neutral500}
          multiline
          textAlignVertical="top"
          maxLength={500}
          className="rounded-xl border border-slate-200 px-4 py-3.5 text-body text-slate-900"
          style={{ minHeight: 140 }}
        />
      </View>

      <View className="px-6 pb-4">
        <Button label={t("contactSupport.send")} variant="primary" disabled={!canSend} onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
}