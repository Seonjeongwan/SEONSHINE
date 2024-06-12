import { useState } from 'react';

import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';

import AccountVerification from '@/components/organims/accountVerification';

import ChooseUserType from './ChooseUserType';
import PendingApprovalPage from './PendingApproval';
import ProfileRegistration from './ProfileRegistration';
import { SignUpStepsType } from './types';

const steps = ['Select User Type', 'Enter User Information', 'Verify OTP', 'Pending Approval'];

const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStepsType>('select_user_type');
  const [userType, setUserType] = useState<string>('');
  const timeCountdown = 120;

  const stepIndexMap: Record<SignUpStepsType, number> = {
    select_user_type: 0,
    enter_user_information: 1,
    verify_otp: 2,
    pending_approval: 3,
  };

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
    <Box sx={{ width: '100%', overflowY: 'hidden' }}>
      <Stepper
        className="pt-20 w-1/2 flex justify-center mx-auto min-h-[20vh]"
        activeStep={stepIndexMap[step]}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {step === 'select_user_type' && <ChooseUserType handleSubmitUserType={handleSubmitUserType} />}
        {step === 'enter_user_information' && (
          <ProfileRegistration
            handleSubmitInformation={handleSubmitInformation}
            userType={userType}
          />
        )}
        {step === 'verify_otp' && (
          <AccountVerification
            title="Account Verification"
            description="An OTP has been sent to your email. 
            Please enter the OTP to verify you account"
            handleSubmitOtp={handleSubmitOtp}
            secondsCountdown={timeCountdown}
            handleResendOtp={handleResendOtp}
            clazzName="min-h-[80vh]"
          />
        )}
        {step === 'pending_approval' && <PendingApprovalPage />}
      </Box>
    </Box>
  );
};

export default SignUpPage;
