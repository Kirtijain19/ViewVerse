/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9e8ff",
          200: "#b5d2ff",
          300: "#88b5ff",
          400: "#5b8eff",
          500: "#3b6ef5",
          600: "#2f56d6",
          700: "#2643ad",
          800: "#223a88",
          900: "#1f326f"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,110,245,.3), 0 20px 40px rgba(15,23,42,.08)"
      }
    }
  },
  plugins: []
};
