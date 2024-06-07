import { create } from 'zustand';
import { CurrentUserType } from '@/types/user';
import { getUserFromCache, saveUserToCache, clearUserFromCache } from '@/utils/persistCache/auth';
import { clearAccessToken, setAccessToken } from '@/utils/persistCache/token';
import { RoleEnum } from '@/types/user';

type AuthStateType = {
  currentUser: CurrentUserType | null;
  setCurrentUser: (userInfo: CurrentUserType | null) => void;
  getCurrentUser: () => CurrentUserType | null;
  isAuthenticated: () => boolean;
  hasRole: (roles: RoleEnum[]) => boolean;
}

const useAuthStore = create<AuthStateType>((set, get) => ({
  currentUser: null,
  setCurrentUser: (userInfo: CurrentUserType | null) => set({ currentUser: userInfo }),
  getCurrentUser: () => get().currentUser,
  isAuthenticated: () => {
    const user = getUserFromCache();
    return !!user && JSON.stringify(user) !== '{}';
  },
  hasRole: (roles: RoleEnum[]) => roles.includes(get().currentUser?.role_id as RoleEnum),
}));

const userInfoFromCache = getUserFromCache();
useAuthStore.setState({ currentUser: userInfoFromCache });

export default useAuthStore;
