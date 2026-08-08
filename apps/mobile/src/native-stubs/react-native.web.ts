// Aliased in vite.config.ts in place of the bare "react-native" import.
// react-native-web covers almost everything, but some RN libraries (e.g.
// react-native-svg's Fabric native-module specs) import native-only APIs
// like TurboModuleRegistry even from code paths reachable on web, purely
// for interfaceOnly/type declarations that are never actually invoked
// there. Rather than chase each missing export individually, provide an
// inert fallback so those imports resolve instead of crashing the module
// graph.
export * from "react-native-web";

function inertNativeModule() {
  return new Proxy(
    {},
    {
      get: () => () => undefined,
    },
  );
}

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => inertNativeModule(),
};
