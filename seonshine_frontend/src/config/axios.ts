import axios from 'axios';

import { useAuth } from '@/hooks/useAuth';
import { getAccessToken } from '@/utils/persistCache/token';

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
    if (error.response.status === 401) {
      console.log('logout');
    }
  },
);

export default axiosInstance;
