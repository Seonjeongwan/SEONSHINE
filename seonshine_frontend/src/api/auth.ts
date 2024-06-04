import axiosInstance from './axios';

interface LoginResponse {
  token: string;
}

export const login = async (employeeId: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', { username: employeeId, password });
  return response.data;
};
