import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0B0D",
        foreground: "#F5F6F8",
        surface: {
          DEFAULT: "#121316",
          elevated: "#181A1F",
          hover: "#20232B",
        },
        border: {
          DEFAULT: "#23262F",
          subtle: "#1C1E24",
          strong: "#2D323E",
        },
        muted: {
          DEFAULT: "#181A1F",
          foreground: "#8D95A5",
        },
        brand: {
          volt: "#E2F952",
          orange: "#FF4800",
          cyan: "#00F0FF",
        },
        card: {
          DEFAULT: "#121316",
          foreground: "#F5F6F8",
        },
        popover: {
          DEFAULT: "#181A1F",
          foreground: "#F5F6F8",
        },
        primary: {
          DEFAULT: "#E2F952",
          foreground: "#0A0B0D",
        },
        secondary: {
          DEFAULT: "#1E2027",
          foreground: "#F5F6F8",
        },
        accent: {
          DEFAULT: "#E2F952",
          foreground: "#0A0B0D",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
