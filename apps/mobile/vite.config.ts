import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "react-native-css-interop",
      babel: {
        presets: ["@babel/preset-flow"],
      },
      include: [/\.[jt]sx?$/, /node_modules\/react-native\//, /node_modules\/@react-native\//],
    }),
  ],
  resolve: {
    alias: [{ find: /^react-native$/, replacement: "react-native-web" }],
    extensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js"],
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["react-native", "react-native-web"],
  },
});
