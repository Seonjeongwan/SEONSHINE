import React, { useState } from 'react';

import { Box } from '@mui/material';

import AccountVerification from '@/components/molecules/accountVerification';

import EnterEmail from './components/EnterEmail';
import EnterNewPassword from './components/EnterNewPassword';

type ForgotPasswordStepsType = 'enter_email' | 'verify_otp' | 'enter_new_password';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<ForgotPasswordStepsType>('enter_email');

  const nextStep = () => {
    setStep((prev) => {
      const nextStep = prev === 'enter_email' ? 'verify_otp' : 'enter_new_password';
      return nextStep;
    });
  };

  const previousStep = () => {
    setStep((prev) => {
      const nextStep = prev === 'enter_new_password' ? 'verify_otp' : 'enter_email';
      return nextStep;
    });
  };

  const handleSubmitEmail = (email: string) => {
    console.log({ email });
    nextStep();
  };

  const handleSubmitPassword = (password: string) => {
    console.log({ password });
  };

  return (
    <Box>
      {step === 'enter_email' ? (
        <EnterEmail handleSubmitEmail={handleSubmitEmail} />
      ) : step === 'verify_otp' ? (
        <AccountVerification
          title="Reset Password"
          handleSubmitOtp={(otp) => {
            console.log({ otp });
            nextStep();
          }}
          secondsCountdown={20}
          handleResendOtp={(resetTimer) => {
            console.log('resend Otp');
            resetTimer();
          }}
        />
      ) : (
        <EnterNewPassword handleSubmitPassword={handleSubmitPassword} />
      )}
    </Box>
  );
};

export default ForgotPasswordPage;
