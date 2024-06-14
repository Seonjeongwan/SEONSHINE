import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Stack, Typography } from '@mui/material';

import { paths } from '@/routes/paths';

const PendingApprovalPage = () => {
  const title = 'Account Verification';
  const description = 'An OTP has been sent to your email. Please enter the OTP to verify your account.';
  const size = 'normal';
  const navigate = useNavigate();

  const renderDescription = description?.split('. ').map((text, index, array) => (
    <React.Fragment key={index}>
      {`${text}${index < array.length - 1 ? '.' : ''}`}
      <br />
    </React.Fragment>
  ));

  const handleClickGoToLogin = () => {
    navigate(paths.login);
  };
  return (
    <Stack
      justifyContent="center"
      className="min-h-screen"
    >
      <Stack
        direction="column"
        justifyContent="center"
        gap={6}
        alignItems="center"
        className={`w-full h-screen p-24 bg-white rounded-lg shadow-md max-w-screen relative ${
          size === 'normal' ? 'md:h-171 md:w-240' : 'md:h-131 md:w-194'
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
        <Box
          sx={{
            width: {
              xs: '240px',
              sm: '300px',
            },
          }}
          className="p-0 pt-6"
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="h-12"
            onClick={handleClickGoToLogin}
          >
            <Typography variant="buttonM">Go to Login</Typography>
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default PendingApprovalPage;
