import axiosInstance from '@/configs/axios';
import { CurrentUserType } from '@/types/user';

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
