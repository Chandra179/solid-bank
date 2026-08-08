import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconShield, IconHelp } from "../components/icons";
import ComingSoon from "../components/ComingSoon";

const ICONS = {
  security: <IconShield size={28} color={colors.brand700} />,
  help: <IconHelp size={28} color={colors.brand700} />,
};

type Props = NativeStackScreenProps<RootStackParamList, "ComingSoon">;

// Generic placeholder destination for the two sub-actions still genuinely
// unbuilt: a PIN-reset re-auth flow (Security's "Change PIN") and live
// support chat (Help's "Contact support"). Every other destination that
// used to land here (Withdraw, Add recipient, Notifications, Edit pocket,
// Security, Help themselves) now has a real screen — see TODO.md.
export default function ComingSoonScreen({ route }: Props) {
  const { title, message, icon } = route.params;
  return <ComingSoon title={title} message={message} icon={ICONS[icon]} />;
}
