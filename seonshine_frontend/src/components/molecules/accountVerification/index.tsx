import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';

interface IFormInput {
  otp: string[];
}

const AccountVerification = () => {
  const { control, handleSubmit, setValue, watch } = useForm<IFormInput>({
    defaultValues: {
      otp: new Array(6).fill(''),
    },
  });
  const otpValues = watch('otp');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  console.log({ otpValues });

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setValue('otp', newOtp);

    // Tự động chuyển sang ô tiếp theo hoặc ô trước đó khi xóa
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = (data: IFormInput) => {
    console.log('OTP Submitted:', data.otp.join(''));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otpValues];
    pasteData.forEach((char, index) => {
      if (/^[0-9]$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setValue('otp', newOtp);
  };

  useEffect(() => {
    if (otpValues.join('').length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [otpValues, handleSubmit, onSubmit]);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="min-h-screen"
    >
      <Box className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        <Typography
          variant="h4"
          className="text-center font-bold mb-4"
        >
          Reset Password
        </Typography>
        <Typography className="text-center mb-8">
          An OTP has been sent to your email. Please enter the OTP to verify your account.
        </Typography>
        <Box
          className="flex justify-center mb-8 space-x-2"
          onPaste={handlePaste}
        >
          {/* {otpValues.map((data, index) => {
            return (
              <TextField
                key={index}
                type="tel"
                name="otp"
                value={data}
                variant="standard"
                onChange={(e) => handleOtpChange(e.target, index)}
                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                className="w-12 h-12"
              />
            );
          })} */}
          {otpValues.map((_, index) => (
            <Controller
              key={index}
              name={`otp.${index}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="tel"
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  className="w-12 h-12"
                  variant="standard"
                  onChange={(e) => handleOtpChange(e as React.ChangeEvent<HTMLInputElement>, index)}
                />
              )}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          className="mb-4"
        >
          Verify
        </Button>
        <Link
          to="#"
          className="block text-center"
        >
          Resend OTP
        </Link>
      </Box>
    </Stack>
  );
};

export default AccountVerification;
