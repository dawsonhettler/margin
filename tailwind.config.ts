import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Didot"', '"Bodoni Moda"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: "#000000",
        surface: "#0A0A0A",
      },
    },
  },
  plugins: [],
};
export default config;
