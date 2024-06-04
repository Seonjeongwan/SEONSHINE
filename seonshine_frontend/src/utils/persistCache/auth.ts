import { USER_INFO_KEY } from '@/constants/authentications';
import { TCurrentUser } from '@/types/user';
import PersistCache from '@/utils/persistCache';

export const saveUserToCache = (data: TCurrentUser) => {
  PersistCache.save(USER_INFO_KEY, JSON.stringify(data));
};

export const getUserFromCache = (): TCurrentUser => {
  return JSON.parse(PersistCache.read(USER_INFO_KEY) || '{}');
};

export const clearUserFromCache = (): void => {
  PersistCache.remove(USER_INFO_KEY);
};
