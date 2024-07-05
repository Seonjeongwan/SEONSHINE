import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormHelperText, Link, Stack, TextField, Typography } from '@mui/material';

import { digitRegex } from '@/constants/regex';

import { AccountVerificationPageProps } from '../../types';
import { ResendSignUpOtpSchemaType, SignUpVerifySchemaType } from '../ProfileRegistration/schema';
import { VerifyOtpSchema, VerifyOtpSchemaType } from './schema';

const AccountVerificationPage = ({
  handleSubmitOtp,
  userEmail,
  title = 'Account Verification',
  description = 'An OTP has been sent to your email. Please enter the OTP to verify your account.',
  secondsCountdown,
  handleResendOtp,
  className,
}: AccountVerificationPageProps) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpSchemaType>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: { code: ' '.repeat(6), email: userEmail },
  });
  const renderDescription = description.split('. ').map((text, index, array) => (
    <React.Fragment key={index}>
      {`${text}${index < array.length - 1 ? '.' : ''}`}
      <br />
    </React.Fragment>
  ));

  const [seconds, setSeconds] = useState<number>(secondsCountdown);
  const [isActive, setIsActive] = useState<boolean>(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number, onChange: (value: string) => void) => {
    const value = e.target.value;
    if (!digitRegex.test(value) && value !== '') return;

    const currentOtp = getValues('code').split('');
    currentOtp[index] = value || ' ';
    onChange(currentOtp.join(''));

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!digitRegex.test(pasteData)) return;

    const newOtp = pasteData.padEnd(6, ' ').split('');
    onChange(newOtp.join(''));
    newOtp.forEach((value, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = value;
        value !== ' ' && inputRefs.current[index]!.focus();
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

  const hanldeClickResendOtp = (data?: ResendSignUpOtpSchemaType) => {
    handleResendOtp(resetTimer, { ...data, email: userEmail });
  };

  const resetTimer = () => {
    setSeconds(secondsCountdown);
    setIsActive(true);
  };

  const submitForm = (data: SignUpVerifySchemaType) => {
    handleSubmitOtp({ ...data, email: userEmail });
  };

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((seconds) => seconds - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, seconds]);

  return (
    <Stack justifyContent="center">
      <form
        onSubmit={handleSubmit(submitForm)}
        noValidate
        className="w-full h-screen pt-12 p-24 bg-white rounded-lg shadow-md max-w-screen relative md:h-171 md:w-240 sm:h-131 sm:w-200 flex flex-col justify-center items-center gap-6"
      >
        <Link
          className="cursor-pointer !underline self-start"
          href="/login"
        >
          Back to Login
        </Link>
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
        <Stack
          direction="column"
          gap="8px"
          alignItems="center"
          className="w-screen md:w-auto "
        >
          <Controller
            name="code"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Stack
                justifyContent="space-around"
                className="gap-4 md:gap-6 w-11/12 md:w-150"
                onPaste={(e: ClipboardEvent<HTMLInputElement>) => handlePaste(e, onChange)}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    type="tel"
                    inputProps={{ maxLength: 1 }}
                    variant="standard"
                    autoComplete="off"
                    value={getValues('code')[index] !== ' ' ? getValues('code')[index] : ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOtpChange(e, index, onChange)}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
                    sx={{ input: { fontWeight: '500', fontSize: { xs: '40px', md: '64px' }, textAlign: 'center' } }}
                  />
                ))}
              </Stack>
            )}
          />
          <FormHelperText
            error={!!errors.code}
            sx={{ marginTop: 1 }}
          >
            {errors?.code?.message}
          </FormHelperText>
          {!isActive && seconds === 0 && (
            <Typography
              component="span"
              variant="subtitleS"
              className="text-red-500 text-center"
            >
              Your OTP has expired. Please click resend OTP and try again
            </Typography>
          )}
        </Stack>
        <Box>
          <Typography
            component="span"
            variant="timer"
          >
            {`${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`}
          </Typography>
        </Box>
        <Stack
          gap="8px"
          alignItems="center"
          flexDirection="column"
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={!isActive}
            className="w-80 md:w-120 h-12"
          >
            <Typography variant="buttonM">Verify</Typography>
          </Button>
          <Button
            variant="text"
            className="text-center w-max font-bold text-md text-black-500"
            disabled={isActive}
            onClick={() => hanldeClickResendOtp()}
          >
            Resend OTP
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default AccountVerificationPage;
