/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5DD3',
        'primary-light': '#F2F1FF',
        secondary: '#FF974A',
        'secondary-light': '#FFF0E6',
        dark: '#11142D',
        gray: '#808191',
        muted: '#B2B3BD',
        danger: '#FF754C',
        success: '#7FBA7A',
        background: '#FCFCFD',
        surface: '#FFFFFF'
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 50px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
