const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
    },
    fontFamily: {
      body: ["Niveau Grotesk", "sans-serif"],
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
      black: 900,
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Don't add black here. You don't want black, you want gray-900.
      white: colors.white,
      gray: colors.stone,
      red: {
        50: "#ffebe6",
        700: "#ea011a",
      },
      green: {
        50: "#ecf3ed",
        400: "#96b49d",
        500: "#6ea36d",
        800: "#465C4A",
      },
      orange: {
        400: "#cfad86",
        500: "#B6A086",
      },

      blue: {
        500: "#7774F2",
      },
    },
  },
  plugins: [],
};
