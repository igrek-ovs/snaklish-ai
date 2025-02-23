/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#4f46e5',
          alternative: '#6366f1',
        },
        warning: {
          main: '#ffc409',
          alternative: '#ffed4a',
        },
        error: {
          main: '#ff5b5b',
          alternative: '#ff8787',
        },
        success: {
          main: '#0acf97',
          alternative: '#2ed573',
        },
        red: {
          DEFAULT: '#ff5656',
          hovered: '#fa4949',
        },
        gray: {
          DEFAULT: '#9ca3af',
          hovered: '#6b7280',
        },
      },
      spacing: {
        9: '2.25rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
