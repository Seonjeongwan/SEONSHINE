import { useState } from 'react';

import AccountVerification from '@/components/organims/accountVerification';

import ChooseUserType from './ChooseUserType';
import PendingApprovalPage from './PendingApproval';
import ProfileRegistration from './ProfileRegistration';
import { SignUpStepsType } from './types';

const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStepsType>('select_user_type');
  const [userType, setUserType] = useState<string>('');
  const timeCountdown = 120;

  const nextStepMap: Record<SignUpStepsType, SignUpStepsType> = {
    select_user_type: 'enter_user_information',
    enter_user_information: 'verify_otp',
    verify_otp: 'pending_approval',
    pending_approval: 'select_user_type',
  };

  const nextStep = () => {
    setStep((prev) => nextStepMap[prev]);
  };

  const handleSubmitUserType = (user_type: string) => {
    setUserType(user_type);
    nextStep();
  };

  const handleSubmitInformation = (user_information: object) => {
    nextStep();
    console.log(user_information);
  };

  const handleSubmitOtp = (otp: string) => {
    nextStep();
  };

  const handleResendOtp = (resetTimer: () => void) => {
    resetTimer();
  };

  return (
    <>
      {step === 'select_user_type' && <ChooseUserType handleSubmitUserType={handleSubmitUserType} />}
      {step === 'enter_user_information' && (
        <ProfileRegistration
          handleSubmitInformation={handleSubmitInformation}
          userType={userType}
        />
      )}
      {step === 'verify_otp' && (
        <AccountVerification
          title="Vefify OTP"
          description="An OTP has been sent to your email. Please enter the OTP to verify your account."
          handleSubmitOtp={handleSubmitOtp}
          secondsCountdown={timeCountdown}
          handleResendOtp={handleResendOtp}
        />
      )}
      {step === 'pending_approval' && <PendingApprovalPage />}
    </>
  );
};

export default SignUpPage;
