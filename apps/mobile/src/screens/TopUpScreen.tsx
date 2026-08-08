import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCard, IconChevronLeft } from "../components/icons";
import SelectRow from "../components/SelectRow";
import { listFundingSources } from "@/data";

type Props = NativeStackScreenProps<RootStackParamList, "TopUp">;

// Step 1 of the top-up flow: choose where the money comes from. Kept as a
// short flat list (no search) since a user only has a handful of funding
// sources, unlike the potentially long beneficiary list on Transfer.
export default function TopUpScreen({ navigation }: Props) {
  const sources = listFundingSources();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">Top Up</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="pb-1 text-[13px] font-semibold text-slate-500">Choose a source</Text>
        {sources.map((s) => (
          <SelectRow
            key={s.id}
            title={s.name}
            subtitle={s.subtitle}
            icon={<IconCard size={18} color={colors.neutral500} />}
            onPress={() =>
              navigation.navigate("AmountEntry", {
                flow: "topup",
                contextId: s.id,
                contextLabel: `From ${s.name}`,
                contextSubLabel: s.subtitle,
              })
            }
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
