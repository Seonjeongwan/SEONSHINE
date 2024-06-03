import axiosInstance from './axios';

interface LoginResponse {
  token: string;
}

export const login = async (employeeId: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', { username: employeeId, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};