/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: "#ff3cf2",
          purple: "#8b5cf6",
          blue: "#00e5ff",
          cyan: "#00ffff",
        },
        glass: {
          dark: "rgba(255, 255, 255, 0.08)",
          light: "rgba(255, 255, 255, 0.15)",
        },
        bgmain: "#0A0F1F",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        neon: "0 0 20px rgba(139, 92, 246, 0.6)",
        neonblue: "0 0 20px rgba(0, 229, 255, 0.6)",
      },
      animation: {
        glow: "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0,229,255,0.3)" },
          "100%": { boxShadow: "0 0 25px rgba(0,229,255,0.9)" },
        },
      },
    },
  },
  plugins: [],
};
