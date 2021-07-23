module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        olivedrab: {
          DEFAULT: "olivedrab",
          dark: "rgb(85,107,47)",
        },
        darkorange: {
          DEFAULT: "darkorange",
          dark: "rgb(139,69,19)",
        },
        darkgray: {
          DEFAULT: "darkgray",
          dark: "rgb(47,79,79)",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
