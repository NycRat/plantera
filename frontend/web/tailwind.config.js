/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "color-light-1": "#00af7c",
        "color-light-2": "#4be286",
        "color-dark-1": "#275c47",
        "color-dark-2": "#226c3e",
      },
    },
    fontFamily: {
      sans: ["Rajdhani", "sans-serif"],
    },
  },
  plugins: [],
};
