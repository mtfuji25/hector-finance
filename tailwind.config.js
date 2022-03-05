const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      logo: ["Glacial Indifference", "sans-serif"],
      body: ["Square", "sans-serif"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Don't add black here. You don't want black, you want gray-900.
      white: colors.white,
      gray: colors.zinc,
      green: {
        50: "#ecf3ed",
        400: "#96b49d",
        800: "#465C4A",
      },
      orange: {
        50: "#fff1e4",
        400: "#f4b575",
        500: "#e0a365",
        600: "#d09457",
        700: "#b57c40",
        800: "#9c6225",
        900: "#754410",
      },
    },
  },
  plugins: [],
};
