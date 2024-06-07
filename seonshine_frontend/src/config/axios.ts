import axios from 'axios';

import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/routes/paths';
import { getAccessToken } from '@/utils/persistCache/token';
import { FORBIDDEN, UNAUTHORIZED } from '@/constants/http';

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
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('error', error);
    if (error.response && (error.response.status === UNAUTHORIZED || error.response.status === FORBIDDEN)) {
      const { logout } = useAuth();

      logout();

      window.location.href = paths.login;
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
