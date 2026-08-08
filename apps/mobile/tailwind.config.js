/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Swap these for real brand colors when you have them — keep a
      // small, deliberate palette rather than tailwind's full default set.
      colors: {
        brand: {
          50: "#eef6ff",
          500: "#2563eb",
          700: "#1d4ed8",
        },
      },
      // Named tokens for the app's actual type scale (see
      // src/theme/typography.ts) — text-[11px]/[13px]/[15px] showed up
      // 160+ times across screens with no semantic name behind any of
      // them. Additive only: existing text-[Npx] usages keep working, new
      // and touched code should prefer text-caption/text-body/text-label.
      fontSize: {
        caption: ["11px", { lineHeight: "16px" }],
        body: ["13px", { lineHeight: "18px" }],
        label: ["15px", { lineHeight: "20px" }],
      },
    },
  },
  plugins: [],
};
