/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#e50914',
        'dark-bg': '#141414',
      },
    },
  },
  plugins: [],
}
