import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconArrowUpRight, IconUser, IconBell, IconMore, IconEdit } from "../components/icons";
import ComingSoon from "../components/ComingSoon";

const ICONS = {
  withdraw: <IconArrowUpRight size={28} color={colors.brand700} />,
  recipient: <IconUser size={28} color={colors.brand700} />,
  notifications: <IconBell size={28} color={colors.brand700} />,
  more: <IconMore size={28} color={colors.brand700} />,
  edit: <IconEdit size={28} color={colors.brand700} />,
};

type Props = NativeStackScreenProps<RootStackParamList, "ComingSoon">;

// Generic placeholder destination for actions that are UI-complete but have
// no real flow behind them yet — reuses the same ComingSoon component
// CardsScreen/PocketsScreen already use for the bottom-nav tabs, so every
// not-built-yet destination in the app reads the same way instead of each
// dead tap getting its own bespoke "soon" treatment. Add a new key to
// `icon`/ICONS above rather than inlining a React element in route params —
// keeps this route's params plain data like every other screen's.
export default function ComingSoonScreen({ route }: Props) {
  const { title, message, icon } = route.params;
  return <ComingSoon title={title} message={message} icon={ICONS[icon]} />;
}
