import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AccountVerification from '@/components/organims/accountVerification';

import { IPlainObject } from '@/types/common';

import { useReSendOTPApi, useResetPasswordApi, useSendOTPApi, useVerifyOTPApi } from '@/apis/hooks/authApi.hook';
import { useLoadingStore } from '@/store/loading.store';

import EnterEmail from './components/EnterEmail';
import EnterNewPassword from './components/EnterNewPassword';
import ResetSuccessfully from './components/ResetSuccessfully';
import { ForgotPasswordStepsType } from './types';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<ForgotPasswordStepsType>('enter_email');
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const timeCountdown = 120;

  const nextStepMap: Record<ForgotPasswordStepsType, ForgotPasswordStepsType> = {
    enter_email: 'verify_otp',
    verify_otp: 'enter_new_password',
    enter_new_password: 'reset_successfully',
    reset_successfully: 'enter_email',
  };

  const setLoading = useLoadingStore((state) => state.setLoading);

  const { mutate: sendOTP, isPending: isPendingSendOTP } = useSendOTPApi();

  const { mutate: reSendOTP, isPending: isPendingReSendOTP } = useReSendOTPApi();

  const { mutate: verifyOTP, isPending: isPendingVerifyOTP } = useVerifyOTPApi();

  const { mutate: resetPassword, isPending: isPendingResetPassword } = useResetPasswordApi();

  const nextStep = () => {
    setStep((prev) => nextStepMap[prev]);
  };

  const handleSubmitEmail = (email: string) => {
    sendOTP(
      { email },
      {
        onSuccess: () => nextStep(),
        onError: (err) => toast.error(err.response.data.error),
      },
    );
    setEmail(email);
  };

  const handleSubmitOtp = (otp: string) => {
    verifyOTP(
      { email, code: otp },
      {
        onSuccess: (res) => {
          setToken(res.token);
          nextStep();
        },
        onError: (err) => toast.error(err.response.data.message),
      },
    );
  };

  const handleResendOtp = (resetTimer: () => void) => {
    reSendOTP(
      { email },
      {
        onSuccess: () => resetTimer(),
        onError: (err) => toast.error(err.response.data.message),
      },
    );
  };

  const handleSubmitPassword = (password: string) => {
    resetPassword(
      { password, token },
      {
        onSuccess: () => nextStep(),
        onError: (err) => toast.error(err.response.data.message),
      },
    );
  };

  useEffect(() => {
    setLoading(isPendingSendOTP || isPendingReSendOTP || isPendingVerifyOTP || isPendingResetPassword);
  }, [isPendingSendOTP, isPendingReSendOTP, isPendingVerifyOTP, isPendingResetPassword]);

  return (
    <>
      {step === 'enter_email' && <EnterEmail handleSubmitEmail={handleSubmitEmail} />}
      {step === 'verify_otp' && (
        <AccountVerification
          title="Reset Password"
          handleSubmitOtp={handleSubmitOtp}
          secondsCountdown={timeCountdown}
          handleResendOtp={handleResendOtp}
          useBackToLogin
          className="relative"
        />
      )}
      {step === 'enter_new_password' && <EnterNewPassword handleSubmitPassword={handleSubmitPassword} />}
      {step === 'reset_successfully' && <ResetSuccessfully />}
    </>
  );
};

export default ForgotPasswordPage;
