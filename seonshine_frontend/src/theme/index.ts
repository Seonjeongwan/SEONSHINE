import { createTheme } from '@mui/material/styles';

import componentsConfig from './components';

const theme = createTheme({
  spacing: 4,
  typography: {
    fontSize: 12,
    fontFamily: 'Roboto',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    ...componentsConfig,
  },
});

export default theme;
