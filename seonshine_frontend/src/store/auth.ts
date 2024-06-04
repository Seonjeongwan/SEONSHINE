import { action, makeObservable, observable } from 'mobx';

import { TCurrentUser } from '@/types/user';
import { getUserFromCache } from '@/utils/persistCache/auth';

export class AuthStore {
  currentUser: TCurrentUser | null = null;

  constructor() {
    makeObservable(this, {
      currentUser: observable,
      setCurrentUser: action,
      getCurrentUser: action,
    });

    const userInfoFromCache = getUserFromCache();
    this.setCurrentUser(userInfoFromCache);
  }

  setCurrentUser(userInfo: TCurrentUser | null) {
    this.currentUser = userInfo;
  }

  getCurrentUser(): TCurrentUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!Object.keys(this.currentUser || {}).length;
  }
}

const authStore = new AuthStore();
export default authStore;
