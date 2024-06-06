import axiosInstance from '@/config/axios';
import { RoleEnum } from '@/types/user';

export type LoginResponseType = {
  token: string;
  user_id: string;
  role_id: RoleEnum;
  username: string;
  phone_number: string;
  branch_id: string;
  email: string;
  password_hash: string;
  confirm_yn: string;
  created_at: string;
  updated_at: string;
};

export const login = async (employeeId: string, password: string): Promise<LoginResponseType> => {
  const response = await axiosInstance.post<LoginResponseType>('/auth/login', { username: employeeId, password });
  return response.data;
};

export const callme = async (): Promise<LoginResponseType> => {
  const response = await axiosInstance.get<LoginResponseType>('/auth/me');
  return response.data;
};
