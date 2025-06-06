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
        unlearned: {
          DEFAULT: '#de7a98',
        },
        learned: {
          DEFAULT: '#4ade80',
        },
        new: {
          DEFAULT: '#d1d1d1',
        },
        total: {
          DEFAULT: '#a1a1aa',
        },
        level : {
          a1: '#10B981',
          a2: '#059669',  
          b1: '#F59E0B',  
          b2: '#D97706',   
          c1: '#EF4444',  
          c2: '#B91C1C',  
        }
      },
      spacing: {
        9: '2.25rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
