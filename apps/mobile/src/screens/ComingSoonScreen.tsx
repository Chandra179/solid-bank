import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconShield, IconHelp, IconCard } from "../components/icons";
import ComingSoon from "../components/ComingSoon";

const ICONS = {
  security: <IconShield size={28} color={colors.brand700} />,
  help: <IconHelp size={28} color={colors.brand700} />,
  card: <IconCard size={28} color={colors.brand700} />,
};

type Props = NativeStackScreenProps<RootStackParamList, "ComingSoon">;

// Generic placeholder destination for the sub-actions still genuinely
// unbuilt: Cards' "Report lost or stolen" (needs a real fraud-ops
// workflow) and "Order a new card" (needs real issuance/logistics). PIN
// reset and live-chat-style support both got real screens instead — see
// TODO.md for the full history of what's moved off this placeholder.
export default function ComingSoonScreen({ route }: Props) {
  const { title, message, icon } = route.params;
  return <ComingSoon title={title} message={message} icon={ICONS[icon]} />;
}