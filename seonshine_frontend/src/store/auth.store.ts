import { create } from 'zustand';
import { CurrentUserType } from '@/types/user';
import { getUserFromCache } from '@/utils/persistCache/auth';

interface AuthState {
  currentUser: CurrentUserType | null;
  setCurrentUser: (userInfo: CurrentUserType | null) => void;
  getCurrentUser: () => CurrentUserType | null;
  isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (userInfo: CurrentUserType | null) => set({ currentUser: userInfo }),
  getCurrentUser: () => get().currentUser,
  isAuthenticated: () => !!Object.keys(get().currentUser || {}).length,
}));

const userInfoFromCache = getUserFromCache();
useAuthStore.setState({ currentUser: userInfoFromCache });

export default useAuthStore;
