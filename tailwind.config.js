/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          600: '#4f46e5',
          700: '#4338ca'
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          600: '#475569',
          700: '#334155'
        },
        danger: {
          50: '#fff1f2',
          100: '#ffe4e6',
          600: '#e11d48',
          700: '#be123c'
        }
      },
      boxShadow: {
        card: '0 10px 40px -24px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
};
