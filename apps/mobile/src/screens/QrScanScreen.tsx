import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { IconChevronLeft, IconQrCode } from "../components/icons";
import { resolveMockQrCode } from "@/data";
import { getQrisFeeMinor } from "@/utils/fees";
import { t } from "@/i18n";

type Props = NativeStackScreenProps<RootStackParamList, "QrScan">;

// QR-first payments — called out in the project's own research
// (docs/digital_bank_indonesia_prep_checklist.md: "QRIS as default, not an
// afterthought") as one of three product priorities, alongside savings
// pockets and e-KYC onboarding, both already built. This was the one
// missing: every existing money-move path (Transfer, Top Up) assumes you
// already know who you're paying — there was no "I'm standing in front of
// a merchant's QR code" entry point at all.
//
// Same mocked-camera caveat as KtpScanScreen/SelfieLivenessScreen (no real
// camera/QR-decode library wired up yet) — but unlike those screens, this
// auto-resolves after a short delay instead of waiting for a tap. Real QR
// scanning is passive (point and it just works), so a tap-to-capture step
// here would misrepresent the actual UX this is standing in for.
//
// Resolves to a merchant, then hands off to the existing AmountEntry ->
// Confirm -> VerifyPin -> Success -> Receipt chain with flow: "transfer" —
// paying a merchant is a transfer out, so this reuses that whole pipeline
// (same pattern PocketDetail's "Add Money" button already uses) rather than
// growing a parallel one.
//
// A merchant with `amountMinor` set is a "dynamic" QRIS code (see
// mockMerchants.ts) — the amount is already fixed by whoever generated the
// code, so there's nothing for the user to type in. That case skips
// AmountEntry and goes straight to Confirm, same params Confirm would have
// received from AmountEntry's own "Continue" button either way.
const SCAN_DELAY_MS = 1400;

export default function QrScanScreen({ navigation }: Props) {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setScanning(false);
      const merchant = resolveMockQrCode();
      // Decided once, here — the one place that actually knows this
      // transfer is a QRIS payment rather than a beneficiary transfer or
      // pocket move — then carried through as `feeMinor` rather than
      // re-derived at Confirm/Receipt. See utils/fees.ts for what decides
      // the value.
      const feeMinor = getQrisFeeMinor();
      if (merchant.amountMinor !== undefined) {
        navigation.replace("Confirm", {
          flow: "transfer",
          contextId: merchant.id,
          contextLabel: `To ${merchant.name}`,
          contextSubLabel: merchant.category,
          amountMinor: merchant.amountMinor,
          feeMinor,
        });
      } else {
        navigation.replace("AmountEntry", {
          flow: "transfer",
          contextId: merchant.id,
          contextLabel: `To ${merchant.name}`,
          contextSubLabel: merchant.category,
          feeMinor,
        });
      }
    }, SCAN_DELAY_MS);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel={t("common.goBack")}
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
        <Text className="text-lg font-semibold text-slate-900">{t("qrScan.title")}</Text>
        <View className="h-10 w-10" />
      </View>

      <View className="px-6 pb-2 pt-2">
        <Text className="text-center text-body text-slate-500">
          {t("qrScan.prompt")}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View
          className="h-72 w-72 items-center justify-center rounded-2xl bg-slate-900"
          accessibilityLabel={scanning ? t("qrScan.scanningLabel") : t("qrScan.foundLabel")}
        >
          <View className="h-56 w-56 items-center justify-center rounded-xl border-2 border-dashed border-white/60">
            <IconQrCode size={64} color={colors.neutral0} />
          </View>
        </View>
        <Text className="pt-6 text-body font-medium text-slate-500" style={{ gap: spacing.sm }}>
          {scanning ? t("qrScan.scanning") : t("qrScan.found")}
        </Text>
      </View>
    </SafeAreaView>
  );
}
