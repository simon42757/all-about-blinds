/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from the All About Blinds business card
        primary: {
          50: '#ffe6f2',
          100: '#ffcce5',
          200: '#ff99cc',
          300: '#ff66b2',
          400: '#ff3399',
          500: '#ff007f', // Main magenta/hot pink color
          600: '#e6007a',
          700: '#cc006b',
          800: '#b3005c',
          900: '#99004d',
        },
        secondary: {
          50: '#e6eeff',
          100: '#ccdcff',
          200: '#99b9ff',
          300: '#6697ff',
          400: '#3374ff',
          500: '#0051ff',
          600: '#0049e6',
          700: '#0041cc',
          800: '#0039b3',
          900: '#002266',
        },
        // Adding navy blue from the business card
        navy: {
          500: '#001755', // Dark navy blue from the card
          600: '#001244',
          700: '#000f33',
          800: '#000c22',
          900: '#000911',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      backgroundColor: theme => ({
        ...theme('colors'),
        'brand-navy': '#001755', // Brand navy blue background
      }),
      textColor: theme => ({
        ...theme('colors'),
        'brand-pink': '#ff007f', // Brand magenta/hot pink text
      }),
    },
  },
  plugins: [],
};
