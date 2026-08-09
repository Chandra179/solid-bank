import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCheck, IconChevronLeft, IconHelp } from "../components/icons";
import Button from "../components/Button";
import { submitSupportMessage } from "@/data";

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
          <Text className="text-xl font-semibold text-slate-900">Message sent</Text>
          <Text className="max-w-[280px] text-center text-body text-slate-500">
            We've got it — expect a reply within one business day. In the meantime, the FAQs might already have your answer.
          </Text>
        </View>
        <View className="w-full pb-4">
          <Button label="Done" variant="primary" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

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
        <Text className="text-lg font-semibold text-slate-900">Contact support</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="items-center px-6 pt-4" style={{ gap: 8 }}>
        <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
          <IconHelp size={24} color={colors.brand700} />
        </View>
        <Text className="text-center text-body text-slate-500">
          Not live chat — send a message and we'll get back to you within one business day.
        </Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="What do you need help with?"
          placeholderTextColor={colors.neutral400}
          multiline
          textAlignVertical="top"
          maxLength={500}
          className="rounded-xl border border-slate-200 px-4 py-3.5 text-body text-slate-900"
          style={{ minHeight: 140 }}
        />
      </View>

      <View className="px-6 pb-4">
        <Button label="Send message" variant="primary" disabled={!canSend} onPress={handleSend} />
      </View>
    </SafeAreaView>
  );
}