/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A112B',
        secondary: '#2E1B4B',
        accent: '#8D5CFF',
        accentSoft: '#7037FF',
        neonGreen: '#22F56A',
        darkBg: '#0B0713',
        card: '#211237'
      },
      fontFamily: {
        display: ['"Poppins"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 25px rgba(141, 92, 255, 0.45)',
        card: '0 12px 40px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
};


