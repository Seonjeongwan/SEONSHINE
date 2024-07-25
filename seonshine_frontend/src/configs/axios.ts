import { toast } from 'react-toastify';

import axios from 'axios';

import { USER_INFO_KEY } from '@/constants/authentications';
import { FORBIDDEN, UNAUTHORIZED } from '@/constants/http';
import { paths } from '@/routes/paths';
import { clearUserFromCache } from '@/utils/persistCache/auth';
import { clearAccessToken, getAccessToken } from '@/utils/persistCache/token';
import SessionCache from '@/utils/sessionCache';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isToastShown = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === UNAUTHORIZED || error.response.status === FORBIDDEN)) {
      if (!isToastShown) {
        isToastShown = true;
        clearUserFromCache();
        clearAccessToken();
        SessionCache.remove(USER_INFO_KEY);
        toast.warning('You are logged out. Please login again.', {
          autoClose: 2000,
          onClose: () => {
            isToastShown = false;
            window.location.href = paths.login;
          },
        });
      }
    }
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  (config) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers['Timezone'] = timezone;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
