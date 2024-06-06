import { CSSProperties } from 'react';

import { TypographyVariantsOptions } from '@mui/material/styles';

type PartialRecord<K extends string | number | symbol, T> = { [P in K]?: T };

type headingTypo = 'heading2';

declare module '@mui/material/styles' {
  interface TypographyVariantsOptions extends PartialRecord<headingTypo, CSSProperties> {}

  interface TypographyVariants extends PartialRecord<headingTypo, CSSProperties> {}
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides extends PartialRecord<headingTypo, true> {}
}

const fontWeightValue = {
  Bold: 700,
  Medium: 500,
  Regular: 400,
  DemiLight: 350,
};

export const customTypographyVariants: TypographyVariantsOptions = {
  heading2: {
    fontSize: '42px',
    fontWeight: fontWeightValue.Bold,
    lineHeight: '46px',
  },
};
