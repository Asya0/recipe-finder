import React, { createContext } from 'react';
import { RootStore } from '@/stores/RootStore';

export const StoreContext = createContext<RootStore | null>(null);

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const rootStore = new RootStore();

  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};
