import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Some RN-ecosystem packages (react-native-svg's vendored PEG.js/Peggy
// parsers, @react-native/assets-registry, ...) are reached via relative or
// deep-subpath imports and ship as raw CommonJS (`module.exports = {...}`)
// with no ESM equivalent — Vite's dep pre-bundling only applies CJS→ESM
// interop to packages it discovers as top-level import specifiers, not to
// files reached this way, so they're served as-is. `module` isn't a
// browser global, and native ESM resolves imports/exports statically, so
// e.g. `import { parse } from './transform'` fails to link before any of
// the file's own code runs. Rewrite the trailing CJS export object into
// real ESM exports, referencing the same already-in-scope local names —
// `export { peg$parse as parse }` for `key: value` entries, `export {
// getAssetByID }` for shorthand entries, and plain `export const`
// declarations for anything that isn't a bare identifier (e.g. array
// literals like `StartRules: ['start']`).
function fixDeepCjsExports(): Plugin {
  const targetRe = /\/node_modules\/(react-native-svg\/lib\/module|@react-native\/assets-registry)\//;
  const tailRe = /module\.exports\s*=\s*\{\n?([\s\S]*?)\n?\};/;
  return {
    name: "fix-deep-cjs-exports",
    transform(code, id) {
      if (!targetRe.test(id.replace(/\\/g, "/"))) return;
      const match = code.match(tailRe);
      if (!match) return;
      const entries = match[1]
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const colonIndex = entry.indexOf(":");
          const key = colonIndex === -1 ? entry : entry.slice(0, colonIndex).trim();
          const value = colonIndex === -1 ? entry : entry.slice(colonIndex + 1).trim();
          return /^[A-Za-z_$][\w$]*$/.test(value) ? { key, value, isIdentifier: true } : { key, value, isIdentifier: false };
        });
      const renames = entries.filter((e) => e.isIdentifier).map((e) => (e.key === e.value ? e.key : `${e.value} as ${e.key}`));
      const consts = entries.filter((e) => !e.isIdentifier).map((e) => `export const ${e.key} = ${e.value};`);
      const replacement = [
        renames.length ? `export { ${renames.join(", ")} };` : "",
        ...consts,
      ]
        .filter(Boolean)
        .join("\n");
      return code.replace(tailRe, replacement);
    },
  };
}

export default defineConfig({
  // react-native-dotenv exposes .env vars as the "API_" prefix (unprefixed
  // in .env) via the "@env" module under Metro; mirror that here so the
  // same .env file works for both.
  envPrefix: ["VITE_", "API_"],
  plugins: [
    fixDeepCjsExports(),
    react({
      jsxImportSource: "react-native-css-interop",
      babel: {
        presets: ["@babel/preset-flow"],
      },
      include: [
        /\.[jt]sx?$/,
        /node_modules\/react-native\//,
        /node_modules\/@react-native\//,
        /node_modules\/react-native-svg\//,
        /node_modules\/react-native-screens\//,
        /node_modules\/react-native-safe-area-context\//,
      ],
      // plugin-react excludes node_modules by default regardless of `include`;
      // react-native (and RN libs that ship un-transpiled Flow source, e.g.
      // react-native-svg's Fabric components) need the babel (preset-flow)
      // pass above, so node_modules can't be excluded here.
      exclude: [],
    }),
  ],
  resolve: {
    alias: [
      // Mirrors the "@/*" -> "src/*" alias in tsconfig.json (type-checking)
      // and babel.config.js's module-resolver plugin (Metro/native builds)
      // so "@/..." imports resolve the same way under the web build too.
      { find: /^@\//, replacement: fileURLToPath(new URL("./src/", import.meta.url)) },
      {
        find: /^react-native$/,
        replacement: fileURLToPath(new URL("./src/native-stubs/react-native.web.ts", import.meta.url)),
      },
      { find: "@env", replacement: fileURLToPath(new URL("./src/env.web.ts", import.meta.url)) },
      {
        find: "react-native/Libraries/Utilities/codegenNativeComponent",
        replacement: fileURLToPath(new URL("./src/native-stubs/codegenNativeComponent.web.ts", import.meta.url)),
      },
    ],
    extensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js"],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
    global: "globalThis",
  },
  optimizeDeps: {
    // Vite's dep pre-bundling scanner parses these with raw esbuild/oxc,
    // bypassing the babel flow-strip above — excluding them forces requests
    // through the normal transform pipeline instead, where Flow gets stripped.
    // react-native-web is NOT included here: it ships pre-compiled plain JS
    // (no Flow), and needs to go through pre-bundling so Vite can apply
    // CJS→ESM interop to its nested CJS dep @react-native/normalize-colors
    // (which processColor imports as a default export).
    //
    // react-native-svg IS excluded, even though it also ships plain JS,
    // because pre-bundling its root barrel makes esbuild's resolver pick
    // its native "./elements" directory (Fabric host components) over the
    // sibling "./elements.web.js" (plain DOM SVG via WebShape) that Vite's
    // own dev-server resolution correctly prefers — esbuild's resolver
    // doesn't honor our custom `resolve.extensions` order the same way.
    // Its nested CJS files that need interop (PEG.js-generated parsers) are
    // patched directly by fixDeepCjsExports above, since they're reached
    // via relative imports that pre-bundling can't redirect anyway.
    exclude: [
      "react-native",
      "react-native-svg",
      "react-native-screens",
      "react-native-safe-area-context",
    ],
  },
});
