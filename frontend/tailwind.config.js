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
        background: '#FDFCFA',
        container: '#FFFFFF',
        header: '#1C1914',
        mainText: '#221F1B',
        descText: '#6B6459',
        metadata: '#96908A',
        borders: '#DDD7C6',
        // Warm cream surfaces sampled from the brand reference (EmBOS palette)
        shell: {
          DEFAULT: '#EAE7DC',
          muted: '#E1DED3',
          deep: '#D8D2BF',
        },
        // Neutral grayscale ramp — used for dark-mode surfaces/text and
        // as the base for the brushed-graphite button/header treatment
        ink: {
          25: '#FAFAFA',
          50: '#F5F5F5',
          100: '#EAEAEB',
          200: '#D6D6D8',
          300: '#B0B0B0',
          400: '#909093',
          500: '#757577',
          600: '#666567',
          700: '#535355',
          800: '#3A3A3C',
          900: '#232325',
          950: '#141415',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        // Brushed-metal sheen sampled from the reference image's active pill
        'sheen': 'linear-gradient(100deg, #4b4944 0%, #c9c4b3 45%, #8f897d 60%, #232120 100%)',
      },
    },
  },
  plugins: [],
}
