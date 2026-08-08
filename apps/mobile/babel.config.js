module.exports = {
  presets: [
    ["module:@react-native/babel-preset"],
    "nativewind/babel",
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["."],
        alias: {
          "@": "./src",
        },
        extensions: [".ios.tsx", ".android.tsx", ".tsx", ".ios.ts", ".android.ts", ".ts", ".jsx", ".js", ".json"],
      },
    ],
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env",
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};
