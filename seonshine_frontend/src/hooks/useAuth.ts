import useAuthStore from '@/store/auth.store';
import { CurrentUserType } from '@/types/user';
import { clearUserFromCache, saveUserToCache } from '@/utils/persistCache/auth';
import { clearAccessToken, setAccessToken } from '@/utils/persistCache/token';

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
  
  const login = (user: CurrentUserType, accessToken: string, saveToCache: boolean) => {
    setCurrentUser(user);
    setAccessToken(accessToken);
    if (saveToCache) {
      saveUserToCache(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearUserFromCache();
    clearAccessToken();
  };

  const updateUserInfo = (user: CurrentUserType) => {
    setCurrentUser(user);
    saveUserToCache(user);
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
