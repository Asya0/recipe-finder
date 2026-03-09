import { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import { RecipeStore } from './RecipeStore/RecipeStore';

const RecipeStoreContext = createContext<RecipeStore | null>(null);

export interface RecipeStoreProviderProps {
  children: ReactNode;
  documentId: string;
}

export const RecipeStoreProvider = ({ children, documentId }: RecipeStoreProviderProps) => {
  const storeRef = useRef<RecipeStore | null>(null);

  if (!storeRef.current || storeRef.current['_documentId'] !== documentId) {
    if (storeRef.current) {
      storeRef.current.destroy();
    }
    storeRef.current = new RecipeStore(documentId);
  }

  useEffect(() => {
    return () => {
      if (storeRef.current) {
        storeRef.current.destroy();
      }
    };
  }, []);

  return (
    <RecipeStoreContext.Provider value={storeRef.current}>{children}</RecipeStoreContext.Provider>
  );
};

export const useRecipeStore = () => {
  const store = useContext(RecipeStoreContext);
  if (!store) {
    throw new Error('useRecipeStore must be used within RecipeStoreProvider');
  }
  return store;
};
