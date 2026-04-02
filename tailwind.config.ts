import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#111118",
        primary: "#6C3AFF",
        accent: "#00F5A0",
        "text-primary": "#F0F0FF",
        "text-muted": "#8888AA",
        "border-glow": "rgba(108, 58, 255, 0.4)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(108, 58, 255, 0.3)",
        "glow-lg": "0 0 40px rgba(108, 58, 255, 0.35)",
        neon: "0 0 24px rgba(0, 245, 160, 0.35)"
      },
      backgroundImage: {
        "grid": "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
        "radial": "radial-gradient(circle at 20% 20%, rgba(108,58,255,0.15), transparent 50%), radial-gradient(circle at 80% 0%, rgba(0,245,160,0.10), transparent 45%)",
        "cyber-gradient": "linear-gradient(135deg, #6C3AFF 0%, #00F5A0 100%)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.05)" },
        },
        dash: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        }
      },
      animation: {
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "draw-border": "dash 1.5s ease-out forwards",
      }
    }
  },
  plugins: []
};

export default config;
