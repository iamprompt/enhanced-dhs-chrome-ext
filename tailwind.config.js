/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Thai', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ['dark'],
      gradientColorStops: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
