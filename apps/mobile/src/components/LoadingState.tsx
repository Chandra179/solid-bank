import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

type LoadingStateProps = {
  // Most call sites are a screen's only content while its query is still
  // resolving on first mount (`if (!data) return <LoadingState />`) — wraps
  // its own SafeAreaView so that early return doesn't need to duplicate a
  // screen's edges/background boilerplate. Screens that already show their
  // own header while just a section below it loads should pass `inline`
  // instead, which renders just the spinner in a flex-1 box.
  inline?: boolean;
};

// The one loading-state pattern this app uses anywhere a query can be
// mid-fetch (see docs/conventions.md's "Loading states" section) — a single
// spinner, deliberately not a skeleton screen (not worth the extra
// per-screen layout work for how briefly this actually shows). Every
// current read resolves in well under a frame in practice, since the
// underlying data/mock*.ts functions are synchronous and React Query's own
// microtask is the only real delay — this exists so the pattern is already
// in place, and reads as intentional rather than a flash of missing
// content, once a real API introduces actual latency here.
export default function LoadingState({ inline = false }: LoadingStateProps) {
  const spinner = <ActivityIndicator size="large" color={colors.brand700} />;
  if (inline) {
    return <View className="flex-1 items-center justify-center py-10">{spinner}</View>;
  }
  return <SafeAreaView className="flex-1 items-center justify-center bg-white">{spinner}</SafeAreaView>;
}
