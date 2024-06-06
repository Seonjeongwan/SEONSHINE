import { CurrentUserType } from '@/types/user';
import { clearUserFromCache, saveUserToCache } from '@/utils/persistCache/auth';
import { clearAccessToken, setAccessToken } from '@/utils/persistCache/token';

import useAuthStore from '@/store/auth.store';

type UseAuthType = {
  authenticated: boolean;
  currentUser: CurrentUserType | null;
  logout: () => void;
  login: (user: CurrentUserType, accessToken: string, saveToCache: boolean) => void;
  updateUserInfo: (user: CurrentUserType) => void;
  updateToken: (accessToken: string) => void;
};

export const useAuth = (): UseAuthType => {
  const { currentUser, setCurrentUser, isAuthenticated } = useAuthStore();

  const authenticated = isAuthenticated();

  const login = (user: CurrentUserType, accessToken: string, rememberMe: boolean) => {
    setCurrentUser(user);
    setAccessToken(accessToken, rememberMe);
    saveUserToCache(user, rememberMe);
  };

  const logout = () => {
    setCurrentUser(null);
    clearUserFromCache();
    clearAccessToken();
  };

  const updateUserInfo = (user: CurrentUserType) => {
    setCurrentUser(user);
    saveUserToCache(user, true);
  };

  const updateToken = (accessToken: string) => {
    setAccessToken(accessToken);
  };

  return {
    authenticated,
    currentUser,
    login,
    logout,
    updateUserInfo,
    updateToken,
  };
};
