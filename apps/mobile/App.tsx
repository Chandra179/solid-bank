import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./src/theme/global.css"; // NativeWind picks up Tailwind classes via this

import RootNavigator from "./src/navigation/RootNavigator";

// Kept intentionally thin: providers only. The route table now lives in
// src/navigation/RootNavigator.tsx and the screen-param types in
// src/navigation/types.ts — this file used to hold all three, which made
// every screen's type import reach across two or three "../" levels back
// up to it (and get that reach-count wrong depending on how nested the
// screen was, e.g. onboarding screens needing "../../../App").
export default function App() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
