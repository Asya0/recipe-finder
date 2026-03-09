import { useContext } from 'react';
import { RootStore } from '@/stores/RootStore';
import { StoreContext } from '@/App/providers/AppProviders';

export const useRootStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within StoreProvider');
  }
  return store;
};