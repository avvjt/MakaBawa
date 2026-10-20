/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        ember: {
          bg: '#11100e',
          panel: '#1a1916',
          card: '#211f1b',
          gold: '#d9ad69',
          cream: '#f4efe6',
          muted: '#a7a094',
        },
      },
    },
  },
  plugins: [],
}
