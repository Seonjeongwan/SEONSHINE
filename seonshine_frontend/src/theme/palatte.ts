import { Color } from '@mui/material';
import { PaletteOptions } from '@mui/material/styles';

import colors from './colors';

declare module '@mui/material/styles' {
  interface Palette {
    blue: Color;
    green: Color;
    red: Color;
    yellow: Color;
    black: Color;
  }

  interface PaletteOptions {
    blue: Partial<Color>;
    green: Partial<Color>;
    red: Partial<Color>;
    yellow: Partial<Color>;
    black: Partial<Color>;
  }
}

const paletteConfig: PaletteOptions = {
  blue: colors.blue,
  green: colors.green,
  yellow: colors.yellow,
  red: colors.red,
  black: colors.black,
  primary: {
    main: colors.blue[500],
  },
  secondary: {
    main: colors.blue[300],
  },
};

export default paletteConfig;
