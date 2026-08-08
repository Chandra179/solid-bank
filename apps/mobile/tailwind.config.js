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
    },
  },
  plugins: [],
};
