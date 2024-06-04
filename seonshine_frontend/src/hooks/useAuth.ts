import { useStore } from '@/hooks/useStore';
import { TCurrentUser } from '@/types/user';
import { clearUserFromCache, saveUserToCache } from '@/utils/persistCache/auth';
import { clearAccessToken, setAccessToken } from '@/utils/persistCache/token';

type TUseAuth = {
  authenticated: boolean;
  currentUser: TCurrentUser | null;
  logout: () => void;
  login: (user: TCurrentUser, accessToken: string) => void;
  updateUserInfo: (user: TCurrentUser) => void;
  updateToken: (accessToken: string) => void;
}

export const useAuth = (): TUseAuth => {
  const { authStore } = useStore();

  const authenticated = authStore.isAuthenticated();

  const currentUser = authStore.getCurrentUser();

  const logout = () => {
    authStore.setCurrentUser(null);
    clearUserFromCache();
    clearAccessToken();
  };

  const login = (user: TCurrentUser, accessToken: string) => {
    authStore.setCurrentUser(user);

    saveUserToCache(user);
    setAccessToken(accessToken);
  };

  const updateUserInfo = (user: TCurrentUser) => {
    authStore.setCurrentUser(user);
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
