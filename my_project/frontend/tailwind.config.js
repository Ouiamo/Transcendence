/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // colors: {
      //   'primary-pink': '#ff44ff',
      //   'dark-bg': '#0f0f0f',
      // },
        safelist: [
    'animate__animated',
    'animate__flip',
    'animate__fadeIn',
    'animate__bounce',
  ],
    },
  },
  
  plugins: [],
}
