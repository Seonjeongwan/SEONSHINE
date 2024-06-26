import { Components } from '@mui/material';

import colors from './colors';

const componentsConfig: Components = {
  MuiButton: {
    defaultProps: {
      variant: 'contained',
    },
  },
  MuiStack: {
    defaultProps: {
      direction: 'row',
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        paddingTop: '14px !important',
        fontSize: '16px',
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginLeft: '0',
        fontSize: '12px',
        color: `${colors.red[500]} !important`,
      },
    },
  },
};

export default componentsConfig;
