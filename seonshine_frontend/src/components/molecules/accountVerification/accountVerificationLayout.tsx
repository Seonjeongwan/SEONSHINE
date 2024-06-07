import React, { ReactNode } from 'react';

import { Stack, Typography } from '@mui/material';

type AccountVerificationLayoutProps = {
  title?: string;
  description: string;
  children: ReactNode;
};

const AccountVerificationLayout: React.FC<AccountVerificationLayoutProps> = ({ title, description, children }) => {
  const splitDescription = description.split('. ').map((text, index, array) => (
    <React.Fragment key={index}>
      {text}
      {index < array.length - 1 ? '.' : ''}
      <br />
    </React.Fragment>
  ));
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="min-h-screen"
    >
      <Stack
        direction="column"
        gap="24px"
        alignItems="center"
        className="w-full p-24 bg-white rounded-lg shadow-md md:w-max xl:w-240 max-w-screen"
      >
        <Typography
          variant="heading2"
          component="h2"
          className="text-center"
        >
          {title}
        </Typography>
        <Typography
          variant="bodyS"
          className="text-center min-w-max"
        >
          {splitDescription}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
};

export default AccountVerificationLayout;
