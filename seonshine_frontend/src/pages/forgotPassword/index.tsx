import React from 'react';

import AccountVerification from '@/components/molecules/accountVerification';

const ForgotPasswordPage = () => {
  return (
    <AccountVerification
      title="Reset Password"
      handleSubmitOtp={(otp) => {
        console.log({ otp });
      }}
      secondsCountdown={10}
      handleResendOtp={(resetTimer) => {
        console.log('resend Otp');
        resetTimer();
      }}
    />
  );
};

export default ForgotPasswordPage;
