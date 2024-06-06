import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import * as zod from 'zod';

import { otpRegex } from '@/constants/regex';

interface IFormInput {
  otp: string;
}

const OtpSchema = zod.object({
  otp: zod.string().trim().regex(otpRegex, 'OTP must have 6 digits'),
});

const AccountVerification: React.FC = () => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: ' '.repeat(6) },
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    onChange: (value: string) => void,
  ) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const currentOtp = getValues('otp').split('');
    currentOtp[index] = value || ' ';
    const newOtp = currentOtp.join('');
    onChange(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.padEnd(6, ' ').split('');
    onChange(newOtp.join(''));
    newOtp.forEach((value, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = value;
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onSubmit = (data: IFormInput) => {
    console.log('OTP Submitted:', data.otp);
  };

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
        className="py-24 px-64 bg-white rounded-lg shadow-md w-[1036px] h-[624px]"
      >
        <Typography variant="heading2">Reset Password</Typography>
        <Typography className="text-center mb-8">
          An OTP has been sent to your email. Please enter the OTP to verify your account.
        </Typography>
        <Controller
          name="otp"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Stack
              justifyContent="center"
              className="gap-6 mb-8 space-x-2"
              onPaste={(e: ClipboardEvent<HTMLInputElement>) => handlePaste(e, onChange)}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  type="tel"
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  variant="standard"
                  autoComplete="off"
                  value={value[index] !== ' ' ? value[index] : ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleOtpChange(e, index, onChange)}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                  sx={{
                    input: {
                      fontWeight: '500',
                      fontSize: '64px',
                    },
                  }}
                />
              ))}
            </Stack>
          )}
        />
        <Box className="">
          <FormHelperText
            error={!!errors.otp}
            sx={{
              marginTop: 1,
            }}
          >
            {errors?.otp?.message}
          </FormHelperText>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit(onSubmit)}
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
      </Stack>
    </Stack>
  );
};

export default AccountVerification;
