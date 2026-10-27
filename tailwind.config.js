/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B132B',
          card: '#1C2541',
          accent: '#3A506B',
          cyan: '#00F5D4',
          neon: '#4CC9F0',
        }
      }
    },
  },
  plugins: [],
}
