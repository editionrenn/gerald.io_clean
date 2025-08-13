import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#011a01',
        accent: '#C0FF00',
      },
    },
  },
  plugins: [],
};
export default config;
