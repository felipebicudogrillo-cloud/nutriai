/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#0b0d10",
          900: "#12151a",
          800: "#1a1e24",
          700: "#242a32",
          600: "#333b45",
          500: "#4b545f",
          400: "#6b7480",
          300: "#9aa3ad",
          200: "#c7ced5",
          100: "#e7ebee",
          50: "#f5f7f8",
        },
        brand: {
          600: "#0f9d6e",
          500: "#14b781",
          400: "#3fd39c",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,20,24,0.04), 0 8px 24px -12px rgba(16,20,24,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
