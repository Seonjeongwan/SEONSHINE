import { useState } from 'react';

import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';

import AccountVerification from '@/components/organims/accountVerification';

import { useSignUpApi } from '@/apis/hooks/signUpApi.hook';

import ChooseUserType from './components/ChooseUserType';
import PendingApprovalPage from './components/PendingApproval';
import ProfileRegistration from './components/ProfileRegistration';
import { SignUpSchemaType } from './components/ProfileRegistration/schema';
import VerificationAccount from './components/VerificationAccount';
import { SignUpStepsType } from './types';

const steps = ['Select User Type', 'Enter User Information', 'Verify OTP', 'Pending Approval'];

const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStepsType>('select_user_type');
  const [userType, setUserType] = useState<string>('');
  const { mutate: signUpUser } = useSignUpApi();

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

  const handleSubmitInformation = (user_information: SignUpSchemaType) => {
    nextStep();
    // signUpUser(user_information);
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
      <Box className="h-20vh min-h-[20vh]">
        <Stepper
          className="pt-20 w-1/2 flex justify-center mx-auto"
          activeStep={stepIndexMap[step]}
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box className="h-80vh min-h-[0vh]">
        {step === 'select_user_type' && <ChooseUserType handleSubmitUserType={handleSubmitUserType} />}
        {step === 'enter_user_information' && (
          <ProfileRegistration
            handleSubmitInformation={handleSubmitInformation}
            userType={userType}
          />
        )}
        {step === 'verify_otp' && (
          <VerificationAccount
            title="Account Verification"
            description="Your account is under approval process now.
Please wait for administrator’s confirmation before using the application"
            handleResendOtp={handleResendOtp}
            handleSubmitOtp={handleSubmitOtp}
          />
        )}
        {step === 'pending_approval' && <PendingApprovalPage />}
      </Box>
    </Box>
  );
};

export default SignUpPage;
