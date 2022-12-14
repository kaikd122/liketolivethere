/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Outfit", "sans-serif"],
      serif: ["Merriweather", "serif"],
      display: ["Krona One", "sans-serif"],
    },
  },
  important: true,
  plugins: [],
};
