import { useContext } from 'react';

import { StoreContext } from '@/store/context';
import { IStoreContext } from '@/types/store';

export const useStore = (): IStoreContext => {
  const rootStore: IStoreContext = useContext(StoreContext);

  return rootStore;
};
