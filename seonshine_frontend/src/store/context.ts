import { createContext } from 'react';

import authStore from './auth';
import { IStoreContext } from '@/types/store';

export const StoreContext = createContext<IStoreContext>({
  authStore,
});
