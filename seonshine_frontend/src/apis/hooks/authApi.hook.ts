import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { LoginSchemaType } from '@/pages/login/schemas';

import {
  LoginResponseType,
  ResetPasswordPayloadType,
  ResetPasswordResponseType,
  SendOTPPayloadType,
  SendOTPResponseType,
  VerifyOTPPayloadType,
  VerifyOTPResponseType,
} from '@/types/auth';
import { IErrorResponse } from '@/types/common';

import { login, reSendOTP, resetPassword, sendOTP, verifyOTP } from '../auth';

export const useLoginApi = (): UseMutationResult<LoginResponseType, IErrorResponse, LoginSchemaType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return await login(payload.employeeId, payload.password);
    },
  });
};

export const useSendOTPApi = (): UseMutationResult<SendOTPResponseType, IErrorResponse, SendOTPPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return await sendOTP(payload);
    },
  });
};

export const useReSendOTPApi = (): UseMutationResult<SendOTPResponseType, IErrorResponse, SendOTPPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return await reSendOTP(payload);
    },
  });
};

export const useVerifyOTPApi = (): UseMutationResult<VerifyOTPResponseType, IErrorResponse, VerifyOTPPayloadType> => {
  return useMutation({
    mutationFn: async (payload) => {
      return await verifyOTP(payload);
    },
  });
};

export const useResetPasswordApi = (): UseMutationResult<
  ResetPasswordResponseType,
  IErrorResponse,
  ResetPasswordPayloadType
> => {
  return useMutation({
    mutationFn: async (payload) => {
      return await resetPassword(payload);
    },
  });
};
