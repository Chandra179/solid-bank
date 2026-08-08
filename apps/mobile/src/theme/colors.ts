// Central color palette, mirrored from tailwind.config.js `brand` colors plus
// the semantic neutrals/success/danger used across screens. Components read
// from here (not hardcoded hex) so this file and tailwind.config.js are the
// only two places a real brand palette swap ever needs to touch.
export const colors = {
  brand50: "#eef6ff",
  brand500: "#2563eb",
  brand700: "#1d4ed8",

  neutral0: "#ffffff",
  neutral50: "#f8fafc",
  neutral100: "#f1f5f9",
  neutral200: "#e2e8f0",
  neutral400: "#94a3b8",
  neutral500: "#64748b",
  neutral700: "#334155",
  neutral900: "#0f172a",

  success100: "#dcfce7",
  success500: "#16a34a",
  warning500: "#d97706",
  danger500: "#dc2626",
} as const;
