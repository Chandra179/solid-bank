import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft, IconHelp } from "../components/icons";
import SelectRow from "../components/SelectRow";

type Props = NativeStackScreenProps<RootStackParamList, "Help">;

type Faq = { q: string; a: string };

const FAQS: Faq[] = [
  { q: "How do I create a pocket?", a: "From Home or the Pockets tab, tap the \"+\" button and give it a name and a savings goal. You can add money to it right away." },
  { q: "Is QRIS free to use?", a: "Scanning and paying a QRIS code has no extra fee in this app." },
  { q: "Can I withdraw money from a pocket?", a: "Yes — open the pocket and tap Withdraw. It moves money back out, capped at whatever's currently saved in that pocket." },
  { q: "How do I change my PIN?", a: "Go to Profile → Security → Change PIN. This flow isn't available yet in this preview." },
];

// Real destination behind Profile's Help row — a static FAQ accordion
// (local expand/collapse state, no backend). "Contact support" still routes
// to ComingSoon: a real support channel (chat or ticketing) is a genuinely
// separate feature, not something to fake with a form that goes nowhere.
export default function HelpScreen({ navigation }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

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
        <Text className="text-lg font-semibold text-slate-900">Help</Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView className="flex-1">
        <View className="mx-6 mt-4 rounded-2xl border border-slate-200 px-4">
          {FAQS.map((faq, i) => (
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
            title="Contact support"
            subtitle="Chat with our team"
            icon={<IconHelp size={18} color={colors.neutral500} />}
            onPress={() =>
              navigation.navigate("ComingSoon", {
                title: "Contact support",
                message: "Live support chat isn't wired up yet — for now, check the FAQs above.",
                icon: "help",
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
