/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#b45309", // vàng nâu ấm, tương tự amber-800 nhưng dịu hơn
          light: "#f59e0b", // vàng sáng nhẹ để hover hoặc icon
          dark: "#78350f", // nâu caramel sâu cho nhấn mạnh
        },
        neutral: {
          50: "#faf9f7",
          100: "#f5f3f0",
          200: "#e7e4df",
          700: "#4b4b4b",
          900: "#262626",
        },
        accent: {
          beige: "#fef6e4",
          terracotta: "#e07a5f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"], // cho tiêu đề
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0,0,0,0.06)",
        glow: "0 0 15px rgba(217,119,6,0.3)",
      },
    },
  },
  plugins: [],
};
