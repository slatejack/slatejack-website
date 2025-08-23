/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'github-dark': '#0d1117',
        'github-gray': '#21262d',
        'github-border': '#30363d',
        'github-text': '#e6edf3',
        'github-blue': '#58a6ff',
        'github-green': '#3fb950',
        'light-bg': '#ffffff',
        'light-gray': '#f6f8fa',
        'light-border': '#d0d7de',
        'light-text': '#24292f',
        'light-secondary': '#656d76'
      }
    }
  },
  plugins: [],
}