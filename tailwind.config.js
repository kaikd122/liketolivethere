/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        petal: "#a743e4",
        petalLight: "#d6a9f7",
      },
    },
    fontFamily: {
      sans: ["Outfit", "sans-serif"],
      serif: ["Merriweather", "serif"],
      display: ["Contrail One", "sans-serif"],
    },
  },
  important: true,
  plugins: [
    require("tailwindcss-textshadow"),
    require("@tailwindcss/line-clamp"),
  ],
};
