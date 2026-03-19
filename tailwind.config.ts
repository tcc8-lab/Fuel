import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fuel: {
          50: '#f0fdf9',
          100: '#ccfbeb',
          200: '#99f6d8',
          300: '#5cebbf',
          400: '#2dd4a3',
          500: '#0fc78e',
          600: '#06a172',
          700: '#05805c',
          800: '#07654b',
          900: '#07533f',
          950: '#022f24',
        },
        surface: {
          0: '#000000',
          50: '#0a0a0a',
          100: '#111111',
          200: '#1a1a1a',
          300: '#222222',
          400: '#2a2a2a',
          500: '#333333',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          amber: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(15,199,142,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,199,142,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
};

export default config;
