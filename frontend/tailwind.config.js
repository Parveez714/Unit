/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F4F5F7',
        container: '#FFFFFF',
        header: '#0C0C0C',
        accent: '#0066CC',
        softBlue: '#E0F2FE',
        mainText: '#1F2937',
        descText: '#4B5563',
        metadata: '#9CA3AF',
        borders: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
