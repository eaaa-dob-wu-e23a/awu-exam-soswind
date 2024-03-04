/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto-Regular", "sans-serif", "Roboto-Bold", "Roboto-Light"],
      },
    },
  },
  plugins: [],
  darkMode: "media",
};
