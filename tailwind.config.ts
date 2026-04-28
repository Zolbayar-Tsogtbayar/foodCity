import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────
//  GLOBAL BRAND COLORS — change here to retheme
//  brand  = primary dark (navy)
//  accent = highlight color (orange)
// ─────────────────────────────────────────────
const brand = {
  50: "#f8fafc", // lightest background tint
  700: "#334155", // borders, dividers
  800: "#1e293b", // secondary dark
  900: "#0f172a", // main dark / navbar
  950: "#020617", // deepest dark
};

const accent = {
  50: "#f0fdf4", // very light tint
  100: "#dcfce7", // light tint
  200: "#bbf7d0", // light border
  400: "#4ade80", // muted / dots
  500: "#22c55e", // primary accent
  600: "#16a34a", // hover state
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
      },
      colors: { brand, accent },
    },
  },
  plugins: [],
};

export default config;
