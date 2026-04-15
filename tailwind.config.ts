import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        warm: "#FAF7F2",
        card: "#FFFFFF",
        ink: "#2C2418",
        subink: "#7A6F60",
        gold: "#C8922A",
        success: "#2D8B46",
        wood: "#3D2B1F",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Lora", "Georgia", "serif"],
        sans: ['"Source Sans 3"', '"DM Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass:
          "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.06)",
        glow: "0 0 14px rgba(200, 146, 42, 0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
