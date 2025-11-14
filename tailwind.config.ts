import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'abril': ['var(--font-abril-fatface)', 'serif'],
      },
      colors: {
        'beige': {
          50: '#faf9f6',
          100: '#f4f1eb',
          200: '#e8e0d4',
          300: '#d9cbb8',
          400: '#c7b09a',
          500: '#b8997f',
          600: '#a88672',
          700: '#8b6f5e',
          800: '#725c4f',
          900: '#5e4c41',
        },
        'cream': {
          50: '#fefcf8',
          100: '#fdf8f0',
          200: '#faf0e1',
          300: '#f5e4cc',
          400: '#efd4ae',
          500: '#e6c190',
          600: '#d9ab78',
          700: '#c2926a',
          800: '#9e765a',
          900: '#80614b',
        }
      }
    },
  },
  plugins: [],
};
export default config;