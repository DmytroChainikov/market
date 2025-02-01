/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: "#000000",
          white: "#FFFFFF",
          yellow: "#FFEB12",
          red: "#FF0909",
          lightGray: "#EFEFEF",
          mediumGray: "#494949",
          darkGray: "#393939",
          softGray: "#D7D7D7",
          neutralGray: "#9C9C9C",
          lavender: "#CBD0F9"
        },
        accent: {
          lightBlue: "#D3D9FD",
          purple: "#6A63CA",
        },
      },
    },
  },
  plugins: [],
};
