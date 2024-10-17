/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: "#f97316",
        secondary: "#ca8a04",
        neutral_1: "#f1f5f9",
        neutral_2: "#cbd5e1",
        neutral_3: "#64748b",
        neutral_4: "#334155",
        neutral_5: "#1e293b"
      }
    },
  },
  plugins: [],
}
