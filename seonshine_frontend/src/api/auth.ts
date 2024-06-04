import axiosInstance from './axios';

export type LoginResponseType = {
  token: string;
  user_id: string;
  role_id: string;
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

export const logout = (): void => {
  localStorage.removeItem('token');
};
