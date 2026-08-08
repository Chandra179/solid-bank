import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCheck } from "../components/icons";
import Button from "../components/Button";
import { formatIDR } from "@/utils/currency";
import { getMoneyFlowCopy } from "@/utils/moneyFlowCopy";

type Props = NativeStackScreenProps<RootStackParamList, "Success">;

// Closes the loop on the flow. "Done" uses popToTop rather than goBack —
// stepping back through Confirm/AmountEntry/the picker after a completed
// transfer would let a user land back on a stale form and get confused
// about whether re-tapping Continue submits a second one.
export default function SuccessScreen({ navigation, route }: Props) {
  const { flow, contextLabel, amountMinor } = route.params;

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-6" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center" style={{ gap: 16 }}>
        <View className="h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <IconCheck size={28} color={colors.success500} />
        </View>
        <Text className="text-xl font-semibold text-slate-900">{getMoneyFlowCopy(flow).successTitle}</Text>
        <Text className="text-4xl font-bold text-slate-900">{formatIDR(amountMinor)}</Text>
        <Text className="text-body text-slate-500">{contextLabel}</Text>
      </View>

      <View className="w-full pb-4" style={{ gap: 12 }}>
        <Button label="Done" variant="primary" onPress={() => navigation.popToTop()} />
        <Pressable onPress={() => navigation.navigate("Receipt", route.params)} className="items-center py-2">
          <Text className="text-body font-semibold text-slate-500">View receipt</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
