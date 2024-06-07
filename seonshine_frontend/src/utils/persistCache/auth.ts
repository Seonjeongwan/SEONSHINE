import { USER_INFO_KEY } from '@/constants/authentications';
import { CurrentUserType } from '@/types/user';
import PersistCache from '@/utils/persistCache';

import SessionCache from '../sessionCache';

export const saveUserToCache = (data: CurrentUserType) => {
  PersistCache.save(USER_INFO_KEY, JSON.stringify(data));
};

export const getUserFromCache = (): CurrentUserType | null => {
  const userData = PersistCache.read(USER_INFO_KEY) || SessionCache.read(USER_INFO_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData) as CurrentUserType;
  } catch {
    return null;
  }
};

export const clearUserFromCache = (): void => {
  PersistCache.remove(USER_INFO_KEY);
};
