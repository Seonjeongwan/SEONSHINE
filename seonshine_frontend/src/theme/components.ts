import { Components } from '@mui/material';

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
        paddingTop: '15px !important',
      },
    },
  },
};

export default componentsConfig;
