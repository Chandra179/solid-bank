// react-native/Libraries/Utilities/codegenNativeComponent registers Fabric
// (native-only) view configs at import time. Several RN libraries (e.g.
// react-native-svg, react-native-screens) still reference it from code paths
// reachable on web, purely for type-only "interfaceOnly" declarations that
// are never actually rendered there. Its real implementation also uses Flow
// syntax our Babel/Flow setup can't parse. Aliased in vite.config.ts to
// stand in for it on web.
export default function codegenNativeComponent(componentName: string) {
  return componentName;
}
