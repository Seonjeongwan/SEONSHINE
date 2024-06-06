import React from 'react';

import AccountVerification from '@/components/molecules/accountVerification';

const ForgotPasswordPage = () => {
  return (
    <AccountVerification
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
