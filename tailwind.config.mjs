/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      spacing: {
        center: "0 auto",
      },
      colors: {
        primary: {
          50: "#F0F7FF",
          100: "#E0EFFF",
          200: "#C2DFFF",
          300: "#99CAFF",
          400: "#66ADFF",
          500: "#3D8BFF",
          600: "#2970CC",
          700: "#1E5599",
          800: "#133A66",
          900: "#0A1F33",
        },
        secondary: {
          50: "#F0F9F6",
          100: "#D9F0E8",
          200: "#B3E0D1",
          300: "#8DCFBA",
          400: "#66BFA3",
          500: "#4CAF8C",
          600: "#3D8C70",
          700: "#2E6954",
          800: "#1F4638",
          900: "#0F231C",
        },
        accent: {
          50: "#FFF8E6",
          100: "#FFEFC0",
          200: "#FFE08A",
          300: "#FFD054",
          400: "#FFC12E",
          500: "#F5B100",
          600: "#CC9200",
          700: "#996E00",
          800: "#664900",
          900: "#332500",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        background: "#F8FAFC", // Light background for better readability
        surface: "#FFFFFF", // Clean white for cards
        text: "#1E293B", // Darker text for better contrast
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)", // Softer shadow for cards
        hover: "0 8px 16px rgba(0, 0, 0, 0.1)", // Shadow for hover states
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
