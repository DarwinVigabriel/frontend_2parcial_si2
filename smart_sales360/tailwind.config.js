/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'steel-gray': '#CFD8DC',
        'steel-blue': '#455A64',
        'graphite': '#212121',
        'lime-green': '#CDDC39',
      },
    },
  },
  plugins: [],
}
