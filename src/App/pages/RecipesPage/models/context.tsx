import { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { RecipesStore } from './RecipesStore/RecipesStore';
import { QueryParamsStore } from '@/stores/RootStore';

const RecipesStoreContext = createContext<RecipesStore | null>(null);

export interface RecipesStoreProviderProps {
  children: ReactNode;
  queryParams?: QueryParamsStore;
}

export const RecipesStoreProvider = ({ children, queryParams }: RecipesStoreProviderProps) => {
  const storeRef = useRef<RecipesStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = new RecipesStore(queryParams);
  }

  useEffect(() => {
    return () => {
      if (storeRef.current) {
        storeRef.current.destroy();
      }
    };
  }, []);

  return (
    <RecipesStoreContext.Provider value={storeRef.current}>{children}</RecipesStoreContext.Provider>
  );
};

export const useRecipesStore = () => {
  const store = useContext(RecipesStoreContext);
  if (!store) {
    throw new Error('useRecipesStore must be used within RecipesStoreProvider');
  }
  return store;
};
