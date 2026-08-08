import React from "react";
import { IconGrid } from "../components/icons";
import { colors } from "../theme/colors";
import ComingSoon from "../components/ComingSoon";

export default function PocketsScreen() {
  return (
    <ComingSoon
      title="Pockets"
      icon={<IconGrid size={28} color={colors.brand700} />}
      message="A full pockets list is on its way — for now, open a pocket from Home."
    />
  );
}
