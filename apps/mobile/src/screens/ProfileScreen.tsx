import React from "react";
import { IconProfile } from "../components/icons";
import { colors } from "../theme/colors";
import ComingSoon from "../components/ComingSoon";

export default function ProfileScreen() {
  return (
    <ComingSoon
      title="Profile"
      icon={<IconProfile size={28} color={colors.brand700} />}
      message="Account settings and KYC status will live here."
    />
  );
}
