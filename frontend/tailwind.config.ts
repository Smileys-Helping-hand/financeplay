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
        background: '#0B1221',
        // Neo-Banking Arcade palette
        neon: {
          gold: '#FFD700',
          blue: '#00D4FF',
          green: '#00FF6A',
          red: '#FF3B5C',
          amber: '#FF9500',
        },
        arcade: {
          bg: '#09090B',       // zinc-950
          card: '#18181B',     // zinc-900
          border: '#27272A',   // zinc-800
          muted: '#71717A',    // zinc-500
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate'), plugin(({ addVariant }) => addVariant('hocus', ['&:hover', '&:focus']))]
};

export default config;
