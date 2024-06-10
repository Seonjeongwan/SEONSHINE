import React, { ReactNode } from 'react';

import { Stack, Typography } from '@mui/material';

type AccountVerificationLayoutProps = {
  title?: string;
  description: string;
  children: ReactNode;
  size?: 'small' | 'normal';
};

const AccountVerificationLayout = ({
  title,
  description,
  children,
  size = 'normal',
}: AccountVerificationLayoutProps) => {
  const renderDescription = description.split('. ').map((text, index, array) => (
    <React.Fragment key={index}>
      {`${text}${index < array.length - 1 ? '.' : ''}`}
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
        justifyContent="center"
        gap="24px"
        alignItems="center"
        className={`w-full h-screen p-24 bg-white rounded-lg shadow-md md:w-max xl:w-240 max-w-screen relative ${
          size === 'normal' ? 'md:h-[600px]' : 'md:h-[460px]'
        }`}
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
          {renderDescription}
        </Typography>
        {children}
      </Stack>
    </Stack>
  );
};

export default AccountVerificationLayout;
