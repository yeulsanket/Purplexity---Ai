/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#202222',
        surface: '#2B2D2D',
        surfaceHover: '#383A3A',
        primary: '#24A0ED', // A brand blue color
        border: '#383A3A',
        sidebarBg: '#191A1A',
        sidebarHover: '#2A2B2B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
