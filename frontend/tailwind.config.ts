import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: '#6F7CFF',
        secondary: '#0EA5E9',
        background: '#0B1221'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), plugin(({ addVariant }) => addVariant('hocus', ['&:hover', '&:focus']))]
};

export default config;
