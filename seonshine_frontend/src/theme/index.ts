import { createTheme } from '@mui/material/styles';

import componentsConfig from './components';
import paletteConfig from './palatte';
import { customTypographyVariants } from './typography';

const theme = createTheme({
  palette: paletteConfig,
  spacing: 4,
  typography: {
    fontFamily: 'Roboto',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    button: {
      textTransform: 'none',
    },
    ...customTypographyVariants,
  },
  components: {
    ...componentsConfig,
  },
  breakpoints: {
    values: {
      xs: 400,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
