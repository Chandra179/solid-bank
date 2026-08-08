import React from "react";
import { IconCard } from "../components/icons";
import { colors } from "../theme/colors";
import ComingSoon from "../components/ComingSoon";

export default function CardsScreen() {
  return (
    <ComingSoon
      title="Cards"
      icon={<IconCard size={28} color={colors.brand700} />}
      message="Card issuance isn't part of this build yet."
    />
  );
}
