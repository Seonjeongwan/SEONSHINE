import { SignUpSchemaType } from '@/pages/signUp/components/ProfileRegistration/schema';

import axiosInstance from '@/configs/axios';

export type SignUpResponseType = { message: string; errorCode: string };
export type SignUpRequestType = {
  user_id: string;
  role_id: string;
  username: string;
  phone_number: string;
  branch_id: string;
  email: string;
  password: string;
};

export const signUp = async (formData: SignUpSchemaType): Promise<SignUpResponseType> => {
  const response = await axiosInstance.post<SignUpResponseType>('/user/sign-up', {
    user_id: formData.employeeId,
    role_id: formData.userType,
    username: formData.fullName,
    phone_number: formData.phoneNumber,
    branch_id: formData.branch_id.toString(),
    email: formData.email,
    password: formData.password,
  });
  return response.data;
};
