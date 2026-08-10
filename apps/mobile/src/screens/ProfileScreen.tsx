import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconCheck, IconShield, IconBell, IconHelp, IconGift } from "../components/icons";
import Button from "../components/Button";
import BottomNav from "../components/BottomNav";
import SelectRow from "../components/SelectRow";
import { getAccountSummary, getUserProfile } from "@/data";
import { useSessionStore } from "../store/session";
import { getInitials } from "@/utils/initials";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

// Closes three gaps flagged in the last design/code review: the user's
// identity had nowhere to live once onboarding finished, KYC status never
// resurfaced after KycPendingScreen, and there was no way back to
// onboarding once logged in. This screen is also what BottomNav's
// "Profile" tab now points to — previously a dead tap.
export default function ProfileScreen({ navigation }: Props) {
  const user = getUserProfile();
  const account = getAccountSummary();
  const isVerified = user.kycStatus === "verified";
  const initials = getInitials(user.name);
  const logOut = useSessionStore((s) => s.clear);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 8 }}>
        <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
          <Text className="text-2xl font-semibold text-slate-900">{t("profile.title")}</Text>
        </View>

        <View className="items-center px-6 pb-4 pt-4" style={{ gap: 12 }}>
          <View className="h-20 w-20 items-center justify-center rounded-full bg-brand-50">
            <Text className="text-2xl font-bold text-brand-700">{initials}</Text>
          </View>
          <View className="items-center" style={{ gap: 2 }}>
            <Text className="text-xl font-semibold text-slate-900">{user.name}</Text>
            <Text className="text-body text-slate-500">{user.phone}</Text>
          </View>
        </View>

        <View className="mx-6 mt-2 rounded-2xl border border-slate-200">
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-body text-slate-500">{t("profile.accountNumber")}</Text>
            <Text className="text-body font-semibold text-slate-900">{account.accountMask}</Text>
          </View>
          <View className="h-px bg-slate-100" />
          <View className="flex-row items-center justify-between px-4 py-4">
            <Text className="text-body text-slate-500">{t("profile.identityVerification")}</Text>
            <View
              className="flex-row items-center rounded-full px-3 py-1"
              style={{ gap: 4, backgroundColor: isVerified ? colors.success100 : colors.warning100 }}
            >
              {isVerified ? (
                <IconCheck size={12} color={colors.success500} />
              ) : (
                <IconShield size={12} color={colors.warning500} />
              )}
              {/* success500/warning500 read fine as the icon fill above
                  (3:1 non-text threshold) but fail 4.5:1 as text on this
                  light badge background — the -600 variants pass and stay
                  visually the same "status color," just darker (see
                  theme/colors.ts). */}
              <Text
                className="text-caption font-semibold"
                style={{ color: isVerified ? colors.success600 : colors.warning600 }}
              >
                {isVerified ? t("profile.verified") : t("profile.pending")}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 mt-6 rounded-2xl border border-slate-200 px-4">
          <SelectRow
            title={t("profile.rewards")}
            subtitle={t("profile.rewardsSubtitle")}
            icon={<IconGift size={18} color={colors.neutral500} />}
            onPress={() => navigation.navigate("Rewards")}
          />
          <View className="h-px bg-slate-100" />
          <SelectRow
            title={t("profile.security")}
            subtitle={t("profile.securitySubtitle")}
            icon={<IconShield size={18} color={colors.neutral500} />}
            onPress={() => navigation.navigate("Security")}
          />
          <View className="h-px bg-slate-100" />
          <SelectRow
            title={t("profile.notifications")}
            subtitle={t("profile.notificationsSubtitle")}
            icon={<IconBell size={18} color={colors.neutral500} />}
            onPress={() => navigation.navigate("NotificationSettings")}
          />
          <View className="h-px bg-slate-100" />
          <SelectRow
            title={t("profile.help")}
            subtitle={t("profile.helpSubtitle")}
            icon={<IconHelp size={18} color={colors.neutral500} />}
            onPress={() => navigation.navigate("Help")}
          />
        </View>

        <View className="px-6 pt-6 pb-4">
          <Button label={t("profile.logOut")} variant="danger" onPress={logOut} />
        </View>
      </ScrollView>
      <BottomNav
        active="profile"
        onChange={(key) => {
          if (key === "home") navigation.navigate("Home");
          if (key === "pockets") navigation.navigate("Pockets");
          if (key === "cards") navigation.navigate("Cards");
        }}
      />
    </SafeAreaView>
  );
}
