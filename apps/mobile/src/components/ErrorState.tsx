import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { IconAlert } from "./icons";
import { t } from "../i18n";

type ErrorStateProps = {
  // Same inline/full-screen split as LoadingState, for the same reason:
  // a screen whose *entire* content is one failed query renders this as
  // its whole body, one whose header/nav is fine but a section below it
  // failed passes `inline` instead.
  inline?: boolean;
  // Every current call site's "error" is a mock query that never actually
  // fails (see data/queries.ts — retry: false, staleTime: Infinity,
  // nothing here has ever thrown), so `onRetry` has never fired in
  // practice. It's wired anyway, calling each query hook's own `refetch`,
  // so the affordance is already correct — not a fake button — for the
  // day a real API call replaces the mock one and can genuinely fail.
  onRetry?: () => void;
};

// The isError counterpart to LoadingState (see docs/conventions.md's
// "Loading states" section, which only ever covered the isLoading half).
// Every screen that already guards on `isLoading` should guard on
// `isError` right after it, in the same shape — this was a real gap: no
// screen anywhere checked `isError`, so a query hook set up with
// `retry: false` had no actual failure UI behind it, only an unhandled
// `undefined` read waiting to happen once queries can genuinely fail.
export default function ErrorState({ inline = false, onRetry }: ErrorStateProps) {
  const content = (
    <View className="items-center px-8 py-10" style={{ gap: 12 }}>
      <View className="h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <IconAlert size={24} color={colors.danger500} />
      </View>
      <View className="items-center" style={{ gap: 4 }}>
        <Text className="text-label font-semibold text-slate-900">{t("errorState.title")}</Text>
        <Text className="text-center text-body text-slate-500">{t("errorState.message")}</Text>
      </View>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={t("errorState.retry")}
          className="mt-2 rounded-full bg-slate-100 px-4 py-2"
        >
          <Text className="text-body font-semibold text-slate-700">{t("errorState.retry")}</Text>
        </Pressable>
      ) : null}
    </View>
  );

  if (inline) {
    return <View className="flex-1 items-center justify-center">{content}</View>;
  }
  return <SafeAreaView className="flex-1 items-center justify-center bg-white">{content}</SafeAreaView>;
}
