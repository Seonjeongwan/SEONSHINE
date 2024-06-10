const colors = require('tailwindcss/colors');
const customColors = require('./src/theme/colors');

export default {
  // corePlugins: {
  //   preflight: false,
  // },
  theme: {
    fontSize: {
      xs: '11px',
      sm: '13px',
      md: '14px',
      base: '15px',
      lg: '16px',
      xl: '18rem',
      '2xl': '1.5rem',
      '3xl': '1.8rem',
      '4xl': '2.25rem',
      '5xl': '2.75rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: colors.white,
      gray: colors.neutral,
      indigo: colors.indigo,
      blue: customColors.blue,
      green: customColors.green,
      yellow: customColors.yellow,
      red: customColors.red,
      black: customColors.black,
    },
    width: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
      screen: '100vw',
      min: 'min-content',
      max: 'max-content',
      58: '14.5rem',
      120: '30rem',
      150: '37.5rem',
      180: '45rem',
      194: '48.5rem',
      240: '60rem',
      280: '70rem',
    }),
    height: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
      27: '6.75rem',
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      full: '100%',
      '80vh': '80vh',
      screen: '100vh',
      58: '14.5rem',
      109: '27.25rem',
      109: '27.25rem',
      120: '30rem',
      145: '36.25rem',
      200: '50rem',
      fit: 'fit-content',
    }),
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'active'],
      boxShadow: ['active'],
    },
  },
  plugins: [],
  content: ['./node_modules/flowbite/**/*.js', './index.html', './src/**/*.{js,ts,jsx,tsx}'],
};
