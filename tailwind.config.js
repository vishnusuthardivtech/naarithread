/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          950: '#060816',
          900: '#0f172a',
          800: '#172033',
          700: '#243047',
          600: '#30415f',
          500: '#4f46e5',
          400: '#38bdf8',
          300: '#93c5fd',
          200: '#dbeafe',
          100: '#eff6ff',
        },
      },
      boxShadow: {
        admin: '0 24px 80px rgba(15, 23, 42, 0.28)',
      },
    },
  },
  plugins: [],
}
