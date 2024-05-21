/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "username": "0.6rem",
        "date": "0.5rem"
      },
      fontWeight: {
        "thinner": "80"
      }
    },
  },
  plugins: [],
}

