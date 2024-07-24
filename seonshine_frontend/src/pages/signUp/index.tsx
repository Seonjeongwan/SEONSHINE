import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Stack, Step, StepLabel, Stepper } from '@mui/material';

import { useDeviceType } from '@/hooks/useDeviceType';
import { RoleEnum } from '@/types/user';

import { useResendSignUpOtp, useSignUpApi, useSignUpVerifyApi } from '@/apis/hooks/signUpApi.hook';
import { useLoadingStore } from '@/store/loading.store';

import ChooseUserType from './components/ChooseUserType';
import PendingApprovalPage from './components/PendingApproval';
import ProfileRegistration from './components/ProfileRegistration';
import {
  ResendSignUpOtpSchemaType,
  SignUpSchemaType,
  SignUpVerifySchemaType,
} from './components/ProfileRegistration/schema';
import AccountVerificationPage from './components/VerificationAccount';
import { SignUpStepsType } from './types';

const steps = ['Select User Type', 'User Information', 'Verify OTP', 'Pending Approval'];

const secondsCountdown = 120;
const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStepsType>('select_user_type');
  const [userType, setUserType] = useState<RoleEnum>(RoleEnum.USER);
  const [userEmail, setUserEmail] = useState<string>('');
  const { mutate: signUpUser, isPending: isSignUpPending } = useSignUpApi();
  const { mutate: verifyOtp, isPending: isVerifyPending } = useSignUpVerifyApi();
  const { mutate: resendOtp, isPending: isResendOtpPending } = useResendSignUpOtp();

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

  // const previousStepMap: Record<SignUpStepsType, SignUpStepsType> = {
  //   select_user_type: 'pending_approval',
  //   enter_user_information: 'select_user_type',
  //   verify_otp: 'enter_user_information',
  //   pending_approval: 'verify_otp',
  // };

  // const previousStep = () => {
  //   setStep((prev) => previousStepMap[prev]);
  // };

  const handleSubmitUserType = (user_type: RoleEnum) => {
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
      onError: (err: any) => {
        console.error(err);
        toast.error(err.response.data.message);
      },
    });
  };

  const handleSubmitOtp = (verify_information: SignUpVerifySchemaType) => {
    verifyOtp(verify_information, {
      onSuccess: () => {
        setLoading(false);
        nextStep();
      },
      onError: (err: any) => {
        console.error(err);
        toast.error(err.response.data.message);
      },
    });
  };

  const handleResendOtp = (resetTimer: () => void, resend_information: ResendSignUpOtpSchemaType) => {
    resetTimer();
    resendOtp(resend_information, {
      onSuccess: (res) => {
        setLoading(false);
        toast.success(res.message);
      },
      onError: (err: any) => {
        console.error(err);
        toast.error(err.response.data.error);
      },
    });
  };

  useEffect(() => {
    setLoading(isSignUpPending);
  }, [isSignUpPending]);

  useEffect(() => {
    setLoading(isVerifyPending);
  }, [isVerifyPending]);

  const { isMobile } = useDeviceType();
  return (
    // <Box className="w-full min-h-screen h-full">
    //   {step !== 'select_user_type' && (
    //     <Button
    //       startIcon={<ArrowBack />}
    //       // onClick={previousStep}
    //       className="ml-4"
    //     >
    //       Back
    //     </Button>
    //   )}
    <Box className="h-full min-h-screen">
      {!isMobile && (
        <Stepper
          className="pt-8 w-1/4 flex justify-center mx-auto"
          activeStep={stepIndexMap[step]}
          alternativeLabel
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      {step === 'select_user_type' && (
        <Stack
          alignItems="center"
          justifyContent="center"
          className="pt-4 md:pt-8"
        >
          <ChooseUserType handleSubmitUserType={handleSubmitUserType} />
        </Stack>
      )}
      {step === 'enter_user_information' && (
        <Stack
          alignItems="center"
          justifyContent="center"
          className="pt-4 md:pt-8 md:pb-16"
        >
          <ProfileRegistration
            handleSubmitInformation={handleSubmitInformation}
            userType={userType}
          />
        </Stack>
      )}
      {step === 'verify_otp' && (
        <Stack
          alignItems="center"
          justifyContent="center"
          className="pt-4 md:pt-8 md:pb-16"
        >
          <AccountVerificationPage
            title="Account Verification"
            description="An OTP has been sent to your email. 
          Please enter the OTP to verify your account"
            handleResendOtp={handleResendOtp}
            handleSubmitOtp={handleSubmitOtp}
            secondsCountdown={secondsCountdown}
            userEmail={userEmail}
          />
        </Stack>
      )}
      {step === 'pending_approval' && (
        <Stack
          alignItems="center"
          justifyContent="center"
          className="pt-4 md:pt-8 md:pb-16"
        >
          <PendingApprovalPage />
        </Stack>
      )}
    </Box>
  );
};

export default SignUpPage;
