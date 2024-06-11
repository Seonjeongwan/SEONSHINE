import { useState } from 'react';

import AccountVerification from '@/components/organims/accountVerification';

import EnterEmail from './components/EnterEmail';
import EnterNewPassword from './components/EnterNewPassword';
import ResetSuccessfully from './components/ResetSuccessfully';
import { ForgotPasswordStepsType } from './types';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<ForgotPasswordStepsType>('enter_email');

  const timeCountdown = 120;

  const nextStepMap: Record<ForgotPasswordStepsType, ForgotPasswordStepsType> = {
    enter_email: 'verify_otp',
    verify_otp: 'enter_new_password',
    enter_new_password: 'reset_successfully',
    reset_successfully: 'enter_email',
  };

  const nextStep = () => {
    setStep((prev) => nextStepMap[prev]);
  };

  const handleSubmitEmail = (email: string) => {
    nextStep();
  };

  const handleSubmitOtp = (otp: string) => {
    nextStep();
  };

  const handleResendOtp = (resetTimer: () => void) => {
    resetTimer();
  };

  const handleSubmitPassword = (password: string) => {
    nextStep();
  };

  return (
    <>
      {step === 'enter_email' && <EnterEmail handleSubmitEmail={handleSubmitEmail} />}
      {step === 'verify_otp' && (
        <AccountVerification
          title="Reset Password"
          handleSubmitOtp={handleSubmitOtp}
          secondsCountdown={timeCountdown}
          handleResendOtp={handleResendOtp}
        />
      )}
      {step === 'enter_new_password' && <EnterNewPassword handleSubmitPassword={handleSubmitPassword} />}
      {step === 'reset_successfully' && <ResetSuccessfully />}
    </>
  );
};

export default ForgotPasswordPage;
