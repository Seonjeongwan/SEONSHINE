import axios from 'axios';

import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/routes/paths';
import { clearAccessToken, getAccessToken } from '@/utils/persistCache/token';

const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken()?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {},
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('error', error);
    if (error.response && error.response.status === 403) {
      const { logout } = useAuth();

      logout();

      console.log('kick out');
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
