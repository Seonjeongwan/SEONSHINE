import { SignUpSchemaType } from '@/pages/signUp/components/ProfileRegistration/schema';

import axiosInstance from '@/config/axios';

export type SignUpResponseType = {};

export const signUp = async (userData: SignUpSchemaType): Promise<SignUpResponseType> => {
  const response = await axiosInstance.post<SignUpResponseType>('/user/signup', { userData });
  return response.data;
};
