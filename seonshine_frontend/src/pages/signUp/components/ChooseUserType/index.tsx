import React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import { Box, Button, Stack, Typography, useMediaQuery } from '@mui/material';

import { useDeviceType } from '@/hooks/useDeviceType';
import { RoleEnum } from '@/types/user';

import { EnterUserTypePropsType } from '../../types';

const ChooseUserType = ({ handleSubmitUserType }: EnterUserTypePropsType) => {
  const { isMobile } = useDeviceType();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="min-h-[80vh]"
    >
      <Stack
        direction="column"
        gap="24px"
        alignItems="center"
        className="w-full p-24 bg-white rounded-lg shadow-md md:w-240 xl:w-240 max-w-screen"
      >
        <Typography
          variant="heading2"
          component="h2"
          className="text-center"
        >
          Sign Up
        </Typography>
        <Typography
          variant="bodyS"
          className="text-center min-w-max"
        >
          Choose your type of user
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          gap={6}
          width="100%"
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <Button
            variant="contained"
            className="bg-blue-100 hover:bg-blue-300 shadow-blue-300 shadow-md"
            fullWidth
            onClick={() => handleSubmitUserType(RoleEnum.USER)} //User
          >
            <Box
              display="flex"
              flexDirection="column"
            >
              <Typography className="pt-8 pb-4">
                <AccountCircleIcon
                  fontSize="large"
                  className="text-black-500"
                />
              </Typography>
              <Typography
                variant="h6"
                display="block"
                className="text-black-500 font-bold"
              >
                Shinhan User
              </Typography>
              <Typography
                display="block"
                className="text-black-500 pb-6"
              >
                For Shinhan Employees
              </Typography>
            </Box>
          </Button>
          <Button
            variant="contained"
            className="bg-yellow-100 hover:bg-yellow-300 shadow-yellow-300 shadow-md"
            fullWidth
            onClick={() => handleSubmitUserType(RoleEnum.RESTAURANT)} //
          >
            <Box
              display="flex"
              flexDirection="column"
            >
              <Typography className="pt-8 pb-4">
                <FoodBankIcon
                  fontSize="large"
                  className="text-black-500"
                />
              </Typography>
              <Typography
                variant="h6"
                display="block"
                className="text-black-500 font-bold"
              >
                Restaurant
              </Typography>
              <Typography
                display="block"
                className="text-black-500 pb-6"
              >
                For Restaurant Administrator
              </Typography>
            </Box>
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ChooseUserType;
