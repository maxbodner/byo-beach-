/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#042C53',
        'navy-light': '#0C447C',
        sky: '#85B7EB',
        'sky-light': '#B5D4F4',
        sun: '#FAC775',
        sand: '#F5C4B3',
        pin: '#D85A30',
        'pin-dark': '#993C1D',
        'stats-bg': '#FAEEDA',
        'stats-text': '#854F0B',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'eq-1': 'eq 1.2s ease-in-out infinite',
        'eq-2': 'eq 0.9s ease-in-out infinite',
        'eq-3': 'eq 1.4s ease-in-out infinite',
        'eq-4': 'eq 1.0s ease-in-out infinite',
        'fade-out': 'fadeOut 400ms ease-in forwards',
        'fade-in': 'fadeIn 600ms ease-out forwards',
      },
      keyframes: {
        eq: {
          '0%, 100%': { height: '30%' },
          '50%': { height: '100%' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0, visibility: 'hidden' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
