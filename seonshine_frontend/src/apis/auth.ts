import axiosInstance from '@/config/axios';
import { CurrentUserType, RoleEnum } from '@/types/user';

export type LoginResponseType = {
  token: string;
  message: string;
  user: CurrentUserType;
  user_status: string;
};

export const login = async (employeeId: string, password: string): Promise<LoginResponseType> => {
  const response = await axiosInstance.post<LoginResponseType>('/user/login', { user_id: employeeId, password });
  return response.data;
};

export const callme = async (): Promise<LoginResponseType> => {
  const response = await axiosInstance.get<LoginResponseType>('/auth/me');
  return response.data;
};
