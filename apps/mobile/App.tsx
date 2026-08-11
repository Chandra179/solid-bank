import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./src/theme/global.css"; // NativeWind picks up Tailwind classes via this

import RootNavigator from "./src/navigation/RootNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";

// One shared cache for every mock-data read in the app (see
// src/data/queries.ts) — replaces the old per-screen useRefreshOnFocus
// workaround with real query caching + explicit invalidation.
// staleTime: Infinity because this mock layer never changes data on its
// own (no background sync, no other client writing to it) — every actual
// change goes through an invalidate() call at the mutation site, so
// there's nothing for a background staleness timer to catch that
// invalidation wouldn't already catch first.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Kept intentionally thin: providers only. The route table lives in
// src/navigation/RootNavigator.tsx and the screen-param types in
// src/navigation/types.ts — this file used to hold all three, which made
// every screen's type import reach across two or three "../" levels back
// up to it (and get that reach-count wrong depending on how nested the
// screen was, e.g. onboarding screens needing "../../../App").
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {/* Was a real gap: nothing caught a render-time throw anywhere in
            the tree, so any uncaught error white-screened the whole app.
            See ErrorBoundary's own comment for what "Try again" does and
            doesn't reset. */}
        <ErrorBoundary>
          <RootNavigator />
        </ErrorBoundary>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
