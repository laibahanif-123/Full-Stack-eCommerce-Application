/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          400: '#3b82f6',
          500: '#1e40af',
          600: '#1e3a8a',
          700: '#172554',
          800: '#0f172a',
        },
        surface: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          DEFAULT: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.1), 0 2px 8px rgba(30, 64, 175, 0.15)',
        nav: '0 1px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
