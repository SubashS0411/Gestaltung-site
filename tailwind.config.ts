import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505", // The deepest black
        obsidian: "#0A0A0A", // Cards / Panels
        charcoal: "#111111",
        gold: {
          DEFAULT: "#D4AF37", // Main luxury gold
          muted: "#8A7E5E", // Secondary text
          light: "#F3E5AB", // Highlights
          dark: "#AA8C2C", // Shadows
        },
        subtle: "rgba(255, 255, 255, 0.08)", // Structural lines
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "line-draw": "lineDraw 1.5s ease-out forwards",
        "curtain-left": "curtainLeft 1s cubic-bezier(0.76, 0, 0.24, 1) forwards",
        "curtain-right": "curtainRight 1s cubic-bezier(0.76, 0, 0.24, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "mask-reveal": "maskReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { boxShadow: "0 0 20px 0px rgba(212, 175, 55, 0.1)" },
          "50%": { boxShadow: "0 0 50px 10px rgba(212, 175, 55, 0.2)" },
        },
        lineDraw: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        curtainLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        curtainRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        maskReveal: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
