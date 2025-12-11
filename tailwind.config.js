/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0e0b16', // Very dark purple/black
        sidebar: '#130f1f',    // Slightly lighter for sidebar
        card: '#1c152e',       // Card background
        hover: '#251b3b',      // Hover state
        primary: '#8b3dff',    // Mellstroy Purple
        primaryHover: '#7a35e0',
        accent: '#00ff47',     // Neon Green
        text: {
          main: '#ffffff',
          secondary: '#8f8f9f',
          muted: '#5e5e6e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    }
  },
  plugins: []
};
