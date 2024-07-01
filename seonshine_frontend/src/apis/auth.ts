import axiosInstance from '@/configs/axios';
import {
  LoginResponseType,
  ResetPasswordPayloadType,
  ResetPasswordResponseType,
  SendOTPPayloadType,
  SendOTPResponseType,
  VerifyOTPPayloadType,
  VerifyOTPResponseType,
} from '@/types/auth';

export const login = async (employeeId: string, password: string): Promise<LoginResponseType> => {
  const response = await axiosInstance.post<LoginResponseType>('/auth/login', { user_id: employeeId, password });
  return response.data;
};

export const sendOTP = async (payload: SendOTPPayloadType): Promise<SendOTPResponseType> => {
  const response = await axiosInstance.post<SendOTPResponseType>('/auth/forgot-password/send-otp', payload);
  return response.data;
};

export const reSendOTP = async (payload: SendOTPPayloadType): Promise<SendOTPResponseType> => {
  const response = await axiosInstance.post<SendOTPResponseType>('/auth/forgot-password/resend-otp', payload);
  return response.data;
};

export const verifyOTP = async (payload: VerifyOTPPayloadType): Promise<VerifyOTPResponseType> => {
  const response = await axiosInstance.post<VerifyOTPResponseType>('/auth/forgot-password/verify-otp', payload);
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayloadType): Promise<ResetPasswordResponseType> => {
  const response = await axiosInstance.post<ResetPasswordResponseType>('/auth/forgot-password/reset-password', payload);
  return response.data;
};
