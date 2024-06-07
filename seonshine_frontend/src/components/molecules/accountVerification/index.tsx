import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormHelperText, Stack, TextField, Typography } from '@mui/material';

import AccountVerificationLayout from '@/components/organims/accountVerification/accountVerificationLayout';

import { OtpSchema, OtpSchemaType } from '@/pages/login/schemas';

import { digitRegex } from '@/constants/regex';

type AccountVerificationProps = {
  title?: string;
  secondsCountdown: number;
  handleSubmitOtp: (otp: string) => void;
  handleResendOtp: (resetTimer: () => void) => void;
};

const AccountVerification = ({
  title = 'Account Verification',
  handleSubmitOtp,
  secondsCountdown,
  handleResendOtp,
}: AccountVerificationProps) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<OtpSchemaType>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: ' '.repeat(6) },
  });

  const [seconds, setSeconds] = useState<number>(secondsCountdown);
  const [isActive, setIsActive] = useState<boolean>(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number, onChange: (value: string) => void) => {
    const value = e.target.value;
    if (!digitRegex.test(value) && value !== '') return;

    const currentOtp = getValues('otp').split('');
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
        inputRefs.current[index].value = value;
        value !== ' ' && inputRefs.current[index].focus();
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

  const hanldeClickResendOtp = () => {
    handleResendOtp(resetTimer);
  };

  const resetTimer = () => {
    setSeconds(secondsCountdown);
    setIsActive(true);
  };

  const onSubmit = (data: OtpSchemaType) => handleSubmitOtp(data.otp);

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
    <AccountVerificationLayout
      title={title}
      description="An OTP has been sent to your email. Please enter the OTP to verify your account."
    >
      <Stack
        direction="column"
        gap="8px"
        alignItems="center"
        className="w-screen md:w-auto"
      >
        <Controller
          name="otp"
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
                  value={value[index] !== ' ' ? value[index] : ''}
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
          error={!!errors.otp}
          sx={{ marginTop: 1 }}
        >
          {errors?.otp?.message}
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
        direction="column"
        gap="8px"
        alignItems="center"
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit(onSubmit)}
          disabled={!isActive}
          className="w-80 md:w-120 h-12"
        >
          <Typography variant="buttonM">Verify</Typography>
        </Button>
        <Button
          variant="text"
          className="text-center w-max font-bold text-md text-black-500"
          disabled={isActive}
          onClick={hanldeClickResendOtp}
        >
          Resend OTP
        </Button>
      </Stack>
    </AccountVerificationLayout>
  );
};

export default AccountVerification;
