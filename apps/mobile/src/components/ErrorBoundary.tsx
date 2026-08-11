import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { IconAlert } from "./icons";
import { t } from "../i18n";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

// Was a real, previously-undiagnosed gap: nothing in this app caught a
// render-time throw, so any uncaught error anywhere in the tree white-
// screened the whole app with no recovery path — not even a "something
// went wrong, reload" message, just a blank screen (or, on web, whatever
// the browser's own unhandled-error behavior does). React only offers one
// way to catch this class of error (getDerivedStateFromError /
// componentDidCatch), which is why this is a class component — there's no
// hook-based equivalent.
//
// "Try again" only resets local state and re-renders `children` — it does
// NOT reset navigation state or any query cache. For an error caused by
// bad navigation params or corrupted cache state, re-rendering the exact
// same tree will throw again immediately. That's an acceptable first pass
// (it's still strictly better than a silent white screen, and it's the
// same "try again, and if that doesn't work, back out" shape ErrorScreen's
// own Cancel-vs-Try-Again split uses), not a claim that every error is
// actually recoverable this way.
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Stand-in for a real crash-reporting call (Sentry, Bugsnag, etc.) —
    // this app has no error-reporting service wired up yet, so console is
    // the only place this is currently visible.
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught a render error:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6" edges={["top", "bottom"]}>
        <View className="items-center" style={{ gap: 16 }}>
          <View className="h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <IconAlert size={28} color={colors.danger500} />
          </View>
          <Text className="text-xl font-semibold text-slate-900">{t("errorState.boundaryTitle")}</Text>
          <Text className="max-w-[280px] text-center text-body text-slate-500">
            {t("errorState.boundaryMessage")}
          </Text>
          <Pressable
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel={t("errorState.retry")}
            className="mt-2 rounded-full bg-slate-100 px-5 py-3"
          >
            <Text className="text-body font-semibold text-slate-700">{t("errorState.retry")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}
