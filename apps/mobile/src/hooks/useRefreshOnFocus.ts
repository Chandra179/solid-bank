import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

// Every screen that reads from the mock data layer only recomputes on
// render, and React Navigation keeps screens mounted across navigations —
// so without this, a screen's data goes stale after e.g. Add Money or
// Create Pocket until the app is fully remounted. Bumping a dummy counter
// on focus is enough to force a re-render (and therefore a fresh read)
// without needing the screen to know *what* changed elsewhere.
//
// This was previously copy-pasted (same `useState` + `useFocusEffect`
// block, same comment) into Home, Pockets, PocketDetail, Transfer, and
// Transactions individually. Centralizing it here means the six current
// call sites — and whichever screen needs it next — share one
// implementation instead of six that have to be kept in sync by hand. This
// is still a workaround for not having a real state/query layer (nothing
// here subscribes to *which* data changed), just no longer a duplicated one.
export function useRefreshOnFocus() {
  const [, forceRefresh] = useState(0);
  useFocusEffect(
    useCallback(() => {
      forceRefresh((n) => n + 1);
    }, [])
  );
}
