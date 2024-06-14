import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Box, Step, StepLabel, Stepper } from '@mui/material';

import { useSignUpApi, useSignUpVerifyApi } from '@/apis/hooks/signUpApi.hook';
import { useLoadingStore } from '@/store/loading.store';

import ChooseUserType from './components/ChooseUserType';
import PendingApprovalPage from './components/PendingApproval';
import ProfileRegistration from './components/ProfileRegistration';
import { SignUpSchemaType, SignUpVerifySchemaType } from './components/ProfileRegistration/schema';
import AccountVerificationPage from './components/VerificationAccount';
import { SignUpStepsType } from './types';

const steps = ['Select User Type', 'Enter User Information', 'Verify OTP', 'Pending Approval'];

const secondsCountdown = 120;
const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStepsType>('select_user_type');
  const [userType, setUserType] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const { mutate: signUpUser, isPending: isSignUpPending } = useSignUpApi();
  const { mutate: verifyOtp, isPending: isVerifyPending } = useSignUpVerifyApi();

  const setLoading = useLoadingStore((state) => state.setLoading);

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
    setLoading(false);
    nextStep();
  };

  const handleSubmitInformation = (user_information: SignUpSchemaType) => {
    setUserEmail(user_information.email);
    signUpUser(user_information, {
      onSuccess: () => {
        setLoading(false);
        nextStep();
      },
      onError: (err) => {
        console.error(err);
        toast.error('Sign up failed!');
      },
    });
  };

  const handleSubmitOtp = (verify_information: SignUpVerifySchemaType) => {
    verifyOtp(verify_information, {
      onSuccess: () => {
        setLoading(false);
        nextStep();
      },
      onError: (err) => {
        console.error(err);
        toast.error('Verify failed!');
      },
    });
  };

  const handleResendOtp = (resetTimer: () => void) => {
    resetTimer();
  };

  useEffect(() => {
    setLoading(isSignUpPending);
  }, [isSignUpPending]);

  useEffect(() => {
    setLoading(isVerifyPending);
  }, [isVerifyPending]);
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
          <AccountVerificationPage
            title="Account Verification"
            description="Your account is under approval process now.
Please wait for administrator’s confirmation before using the application"
            handleResendOtp={handleResendOtp}
            handleSubmitOtp={handleSubmitOtp}
            secondsCountdown={secondsCountdown}
            userEmail={userEmail}
          />
        )}
        {step === 'pending_approval' && <PendingApprovalPage />}
      </Box>
    </Box>
  );
};

export default SignUpPage;
