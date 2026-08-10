import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconHelp } from "../components/icons";
import SelectRow from "../components/SelectRow";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Help">;

type Faq = { q: string; a: string };

function getFaqs(): Faq[] {
  return [
    { q: t("help.faqs.createPocketQ"), a: t("help.faqs.createPocketA") },
    { q: t("help.faqs.qrisFreeQ"), a: t("help.faqs.qrisFreeA") },
    { q: t("help.faqs.withdrawQ"), a: t("help.faqs.withdrawA") },
    { q: t("help.faqs.changePinQ"), a: t("help.faqs.changePinA") },
  ];
}

// Real destination behind Profile's Help row — a static FAQ accordion
// (local expand/collapse state, no backend). "Contact support" now opens a
// real "send us a message" form (ContactSupportScreen) — not live chat
// (that's still an honest ComingSoon gap; see CardsScreen for the same
// pattern applied to fraud reporting/card issuance), but a real,
// captured message instead of a form that goes nowhere.
export default function HelpScreen({ navigation }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const faqs = getFaqs();

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
        <Text className="text-lg font-semibold text-slate-900">{t("help.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView className="flex-1">
        <View className="mx-6 mt-4 rounded-2xl border border-slate-200 px-4">
          {faqs.map((faq, i) => (
            <React.Fragment key={faq.q}>
              {i > 0 ? <View className="h-px bg-slate-100" /> : null}
              <Pressable onPress={() => setExpanded((prev) => (prev === i ? null : i))} className="py-4">
                <Text className="text-label font-semibold text-slate-900">{faq.q}</Text>
                {expanded === i ? <Text className="pt-2 text-body text-slate-500">{faq.a}</Text> : null}
              </Pressable>
            </React.Fragment>
          ))}
        </View>

        <View className="mx-6 mt-6 rounded-2xl border border-slate-200 px-4">
          <SelectRow
            title={t("help.contactSupport")}
            subtitle={t("help.sendUsAMessage")}
            icon={<IconHelp size={18} color={colors.neutral500} />}
            onPress={() => navigation.navigate("ContactSupport")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}