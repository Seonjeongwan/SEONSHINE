import { createTheme } from '@mui/material/styles';

import componentsConfig from './components';
import { customTypographyVariants } from './typography';

const theme = createTheme({
  spacing: 4,
  typography: {
    fontFamily: 'Calibri',
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
});

export default theme;
