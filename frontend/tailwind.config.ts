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
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      },
      fontSize: {
        // Display
        'display': ['56px', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        // H1
        'h1': ['48px', { lineHeight: '1.15' }],
        // H2
        'h2': ['36px', { lineHeight: '1.2' }],
        // H3
        'h3': ['24px', { lineHeight: '1.3' }],
        // Body Large
        'body-lg': ['18px', { lineHeight: '1.6' }],
        // Body Regular
        'body': ['16px', { lineHeight: '1.6' }],
        // Body Small
        'body-sm': ['14px', { lineHeight: '1.5' }],
        // Caption
        'caption': ['12px', { lineHeight: '1.4' }],
      },
      colors: {
        // Heritage Collection - Primary
        'heritage-navy': '#1A2332',
        'slate-charcoal': '#2D3E4F',
        'cream-ivory': '#F9F8F5',
        'off-white-linen': '#EFEBE6',

        // Heritage Collection - Accents
        'muted-gold': '#A89968',
        'soft-sage': '#8B9A7D',
        'champagne-beige': '#D4C4B8',
        'slate-blue': '#5A7A8A',

        // Heritage Collection - Hierarchy Grays
        'hierarchy-1': '#1A1A1A',
        'hierarchy-2': '#666666',
        'hierarchy-3': '#B0B0B0',
        'hierarchy-4': '#E0DCD7',
        'hierarchy-5': '#F5F3F0',
      },
      boxShadow: {
        'elevation-1': '0 2px 6px rgba(26, 35, 50, 0.05)',
        'elevation-2': '0 4px 12px rgba(26, 35, 50, 0.08)',
        'elevation-3': '0 8px 24px rgba(26, 35, 50, 0.12)',
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    plugin(({ addVariant }) => addVariant('hocus', ['&:hover', '&:focus']))
  ]
};

export default config;
