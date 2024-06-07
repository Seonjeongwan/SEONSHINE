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
      handleResendOtp={() => {
        console.log('resend Otp');
      }}
    />
  );
};

export default ForgotPasswordPage;
