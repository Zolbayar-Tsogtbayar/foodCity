import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────
//  GLOBAL BRAND COLORS — change here to retheme
//  brand  = primary dark (navy)
//  accent = highlight color (orange)
// ─────────────────────────────────────────────
const brand = {
  50:  "#f8fafc",  // lightest background tint
  700: "#334155",  // borders, dividers
  800: "#1e293b",  // secondary dark
  900: "#0f172a",  // main dark / navbar
  950: "#020617",  // deepest dark
};

const accent = {
  50:  "#fff7ed",  // very light tint
  100: "#ffedd5",  // light tint
  200: "#fed7aa",  // light border
  400: "#fb923c",  // muted / dots
  500: "#f97316",  // primary accent
  600: "#ea580c",  // hover state
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
