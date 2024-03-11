/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto-Regular", "sans-serif", "Roboto-Bold", "Roboto-Light"],
      },
      colors: {
        light: {
          DEFAULT: "#F3F4F6", // Default light mode background color
          text: "#000", // Default light mode text color
          navbg: "#fff",
        },
        dark: {
          DEFAULT: "#000", // Default dark mode background color
          text: "#FFFFFF", // Default dark mode text color
        },
      },
    },
  },
  darkMode: "media", // Enable dark mode using class
  plugins: [],
};
