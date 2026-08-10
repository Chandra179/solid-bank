import React from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { IconPocket } from "./icons";
import { formatIDR } from "@/utils/currency";
import { getPocketPaceStatus, pocketPaceColor, pocketPaceShortLabel, pocketPaceTextColor } from "@/utils/pocketPacing";
import type { Pocket } from "@/data";
import { t } from "@/i18n";

export type { Pocket };

type PocketCardProps = {
  pocket: Pocket;
  onPress?: () => void;
  // "compact" (default) is the fixed-width card Home's horizontal-scroll
  // row uses, matching the Figma PocketCard component. "full" stretches to
  // the parent's width for a vertical list (see screens/PocketsScreen.tsx)
  // — same content and behavior, just not clipped to 180px.
  variant?: "compact" | "full";
};

// Matches the PocketCard component in Figma: icon + name header, progress
// bar, "saved of target" caption.
export default function PocketCard({ pocket, onPress, variant = "compact" }: PocketCardProps) {
  const pct = pocket.targetMinor > 0 ? Math.min(1, pocket.savedMinor / pocket.targetMinor) : 0;
  // Was always success-green regardless of how close a pocket actually was
  // to its goal or deadline — a pocket badly behind its own target date
  // looked identical to one comfortably ahead. Pockets with no target date
  // keep the old steady-green look (getPocketPaceStatus returns "no-target"
  // for those, which pocketPaceColor maps back to success-green) since
  // there's nothing to be "behind" without a date to measure against.
  const paceStatus = getPocketPaceStatus(pocket);
  const paceColor = pocketPaceColor(paceStatus);
  // WCAG 1.4.1 (Use of Color) fix: the progress bar's color alone used to
  // be the only signal of how a pocket was pacing — a colorblind user had
  // no way to tell "on track" green from "behind" amber/red. This short
  // caption (null for no-target/funded, where there's nothing to be
  // behind on) gives the same information as text, using pocketPaceTextColor
  // rather than the fill color since captions need 4.5:1, not just 3:1.
  const paceLabel = pocketPaceShortLabel(paceStatus);
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border border-slate-200 bg-white p-4 ${variant === "compact" ? "w-[180px]" : "w-full"}`}
      style={{ gap: spacing.md }}
    >
      <View className="flex-row items-center" style={{ gap: spacing.sm }}>
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
          <IconPocket size={18} color={colors.brand700} />
        </View>
        <Text className="flex-1 text-body font-semibold text-slate-900" numberOfLines={1}>
          {pocket.name}
        </Text>
        {/* Small badge distinguishing a shared/group pocket from a solo one
            at a glance, without needing to open it — see data/types.ts's
            Pocket.participants. */}
        {pocket.participants && pocket.participants.length > 0 ? (
          <View className="rounded-full bg-slate-100 px-2 py-0.5">
            <Text className="text-caption font-semibold text-slate-500">{t("pocketCard.shared")}</Text>
          </View>
        ) : null}
      </View>
      <View className="h-1.5 rounded-full bg-slate-100">
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${pct * 100}%`, backgroundColor: paceColor }}
        />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-caption text-slate-500">
          {t("pocketCard.savedOfTarget", { saved: formatIDR(pocket.savedMinor), target: formatIDR(pocket.targetMinor) })}
        </Text>
        {paceLabel ? (
          <Text className="text-caption font-semibold" style={{ color: pocketPaceTextColor(paceStatus) }}>
            {paceLabel}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
