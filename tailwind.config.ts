import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#0A0A0A",
        "surface-elevated": "#121212",
        border: "#222222",
        "border-light": "#333333",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A0A0A0",
        "text-muted": "#707070",
        "financial-positive": "#4E8752",
        "financial-negative": "#A84E4E",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Didot", "Bodoni MT", "Georgia", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
