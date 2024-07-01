import {
  ResendSignUpOtpSchemaType,
  SignUpSchemaType,
  SignUpVerifySchemaType,
} from '@/pages/signUp/components/ProfileRegistration/schema';

import axiosInstance from '@/configs/axios';

export type SignUpResponseType = { message: string; errorCode: string };
export type SignUpVerifyResponseType = { message: string; errorCode: string };
export type ResendSignUpOtpResponseType = { message: string; errorCode: string };

export const signUp = async (formData: SignUpSchemaType): Promise<SignUpResponseType> => {
  const response = await axiosInstance.post<SignUpResponseType>('/auth/sign-up', {
    user_id: formData.employeeId,
    role_id: formData.userType,
    username: formData.fullName,
    phone_number: formData.phoneNumber,
    branch_id: formData.branch_id || undefined,
    email: formData.email,
    password: formData.password,
    address: formData.address || undefined,
  });
  return response.data;
};

export const signUpVerify = async (formData: SignUpVerifySchemaType): Promise<SignUpVerifyResponseType> => {
  const response = await axiosInstance.post<SignUpVerifyResponseType>('/auth/verify-sign-up', {
    code: formData.code,
    email: formData.email,
  });
  return response.data;
};

export const resendSignUpOtp = async (formData: ResendSignUpOtpSchemaType): Promise<ResendSignUpOtpResponseType> => {
  const response = await axiosInstance.post<ResendSignUpOtpResponseType>('/auth/sign-up/resend-otp', {
    email: formData.email,
  });
  return response.data;
};
