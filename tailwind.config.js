// tailwind.config.js
module.exports = {
  content: [
    "./src/views/**/*.ejs",
    "./public/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          400: "#7289da", // Discord-like blue
          600: "#5865f2", // Slightly darker
        },
        gray: {
          900: "#202225", // Darker background
          400: "#b9bbbe", // Lighter text
        },
      },
      borderRadius: {
        lg: "0.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
