import { Fragment, useState } from 'react';

import { Box } from '@mui/material';

import AccountVerification from '@/components/molecules/accountVerification';

import EnterEmail from './components/EnterEmail';
import EnterNewPassword from './components/EnterNewPassword';
import ResetSuccessfully from './components/ResetSuccessfully';
import { ForgotPasswordStepsType } from './types';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<ForgotPasswordStepsType>('enter_email');

  const nextStep = () => {
    setStep((prev) => {
      switch (prev) {
        case 'enter_email':
          return 'verify_otp';
        case 'verify_otp':
          return 'enter_new_password';
        case 'enter_new_password':
          return 'reset_successfully';
        default:
          return 'enter_email';
      }
    });
  };

  const handleSubmitEmail = (email: string) => {
    console.log({ email });
    nextStep();
  };

  const handleSubmitOtp = (otp: string) => {
    console.log({ otp });
    nextStep();
  };

  const handleResendOtp = (resetTimer: () => void) => {
    console.log('resend Otp');
    resetTimer();
  };

  const handleSubmitPassword = (password: string) => {
    console.log({ password });
    nextStep();
  };

  return (
    <Fragment>
      {step === 'enter_email' && <EnterEmail handleSubmitEmail={handleSubmitEmail} />}
      {step === 'verify_otp' && (
        <AccountVerification
          title="Reset Password"
          handleSubmitOtp={handleSubmitOtp}
          secondsCountdown={20}
          handleResendOtp={handleResendOtp}
        />
      )}
      {step === 'enter_new_password' && <EnterNewPassword handleSubmitPassword={handleSubmitPassword} />}
      {step === 'reset_successfully' && <ResetSuccessfully />}
    </Fragment>
  );
};

export default ForgotPasswordPage;
