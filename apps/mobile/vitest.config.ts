import { fileURLToPath } from "node:url";
// vitest/config's defineConfig (not plain "vite") — its type merges in the
// `test` block below and, more importantly here, its config-file loader
// handles this project's CJS-by-default package.json (no "type": "module")
// without the ESM/CJS resolution conflict that loading vite's own
// defineConfig from vitest.config.ts otherwise hits.
import { defineConfig } from "vitest/config";

// Deliberately separate from vite.config.ts, not `vitest/config`'s
// mergeConfig over it: that file's plugin stack (fixDeepCjsExports, the
// react-native.web.ts alias, the flow-stripping babel preset) exists to
// make React Native component code run in a browser-shaped dev server —
// none of that applies here. Every test this project has today
// (src/**/*.test.ts, see tests/README or the files alongside utils/data)
// covers plain TypeScript logic (currency formatting, fee/pacing
// calculations, the mock data-repository mutations) with no RN or DOM
// import in the chain, so a plain Node environment is both correct and a
// lot faster than spinning up jsdom + the web config's RN shims for every
// run. If a screen/component test gets added later, give it jsdom via a
// per-file `// @vitest-environment jsdom` pragma rather than flipping this
// file's default for every test.
export default defineConfig({
  resolve: {
    alias: [
      // Mirrors tsconfig.json's "@/*" -> "src/*" path mapping so test
      // files can import the same way application code does.
      { find: /^@\//, replacement: fileURLToPath(new URL("./src/", import.meta.url)) },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
