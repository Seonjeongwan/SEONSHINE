import { USER_INFO_KEY } from '@/constants/authentications';
import { CurrentUserType } from '@/types/user';
import { clearUserFromCache, saveUserToCache } from '@/utils/persistCache/auth';
import { clearAccessToken, setAccessToken } from '@/utils/persistCache/token';
import SessionCache from '@/utils/sessionCache';

import useAuthStore from '@/store/auth.store';

type UseAuthType = {
  currentUser: CurrentUserType | null;
  logout: () => void;
  login: (user: CurrentUserType, accessToken: string) => void;
  updateUserInfo: (user: CurrentUserType) => void;
  updateToken: (accessToken: string) => void;
};

export const useAuth = (): UseAuthType => {
  const { currentUser, setCurrentUser } = useAuthStore();

  const login = (user: CurrentUserType, accessToken: string) => {
    setCurrentUser(user);
    setAccessToken(accessToken);
    saveUserToCache(user);
  };

  const logout = () => {
    setCurrentUser(null);
    clearUserFromCache();
    clearAccessToken();
    SessionCache.remove(USER_INFO_KEY);
  };

  const updateUserInfo = (user: CurrentUserType) => {
    setCurrentUser(user);
    saveUserToCache(user);
  };

  const updateToken = (accessToken: string) => {
    setAccessToken(accessToken);
  };

  return {
    currentUser,
    login,
    logout,
    updateUserInfo,
    updateToken,
  };
};
