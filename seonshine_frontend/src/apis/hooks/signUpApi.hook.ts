import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { ResendSignUpOtpSchemaType, SignUpSchemaType, SignUpVerifySchemaType } from '@/pages/signUp/components/ProfileRegistration/schema';

import { resendSignUpOtp, ResendSignUpOtpResponseType, signUp, SignUpResponseType, signUpVerify, SignUpVerifyResponseType } from '../signUp';

export const useSignUpApi = (): UseMutationResult<SignUpResponseType, unknown, SignUpSchemaType> => {
  return useMutation({
    mutationFn: signUp,
  });
};

export const useSignUpVerifyApi = (): UseMutationResult<SignUpVerifyResponseType, unknown, SignUpVerifySchemaType> => {
  return useMutation({
    mutationFn: signUpVerify,
  });
};

export const useResendSignUpOtp = (): UseMutationResult<ResendSignUpOtpResponseType, unknown, ResendSignUpOtpSchemaType> => {
  return useMutation({
    mutationFn: resendSignUpOtp,
  });
};
