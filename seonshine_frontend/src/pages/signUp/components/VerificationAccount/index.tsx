import React from 'react';

import { Stack, Typography } from '@mui/material';

import AccountVerification from '@/components/organims/accountVerification';

type VerificationAccountProps = {
  title: string;
  description: string;
  handleSubmitOtp: (otp: string) => void;
  handleResendOtp: (resetTimer: () => void) => void;
};
const timeCountdown = 120;
const VerificationAccount = ({ title, description, handleResendOtp, handleSubmitOtp }: VerificationAccountProps) => {
  return (
    <AccountVerification
      title={title}
      description={description}
      secondsCountdown={timeCountdown}
      handleResendOtp={handleResendOtp}
      handleSubmitOtp={handleSubmitOtp}
      // className="min-h-[80vh]"
    />
  );
};

export default VerificationAccount;
