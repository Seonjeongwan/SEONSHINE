import { CSSProperties } from 'react';

import { TypographyVariantsOptions } from '@mui/material/styles';

type PartialRecord<K extends string | number | symbol, T> = { [P in K]?: T };

type headingTypo = 'heading1' | 'heading2' | 'bodyS' | 'buttonM' | 'timer' | 'subtitleS';

declare module '@mui/material/styles' {
  interface TypographyVariantsOptions extends PartialRecord<headingTypo, CSSProperties> {}

  interface TypographyVariants extends PartialRecord<headingTypo, CSSProperties> {}
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides extends PartialRecord<headingTypo, true> {}
}

const fontWeightValue = {
  SupperBold: 900,
  ExtraBold: 800,
  Bold: 700,
  Medium: 500,
  Regular: 400,
  DemiLight: 350,
};

export const customTypographyVariants: TypographyVariantsOptions = {
  heading1: {
    fontSize: '64px',
    fontWeight: fontWeightValue.SupperBold,
    lineHeight: '75px',
    textShadow: '0 4px 4px rgba(0, 0, 0, 0.5)',
    textTransform: 'uppercase',
  },
  heading2: {
    fontSize: '42px',
    fontWeight: fontWeightValue.Bold,
    lineHeight: '46px',
  },
  bodyS: {
    fontSize: '14px',
    fontWeight: fontWeightValue.Regular,
    lineHeight: '20px',
  },
  buttonM: {
    fontSize: '16px',
    fontWeight: fontWeightValue.Medium,
    lineHeight: '16px',
  },
  timer: {
    fontSize: '36px',
    fontWeight: fontWeightValue.Bold,
    lineHeight: '40px',
  },
  subtitleS: {
    fontSize: '12px',
    fontWeight: fontWeightValue.Regular,
    lineHeight: '16px',
  },
};
