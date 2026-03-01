import { RecipeStore } from '@/stores/RecipeStore/RecipeStore';
import { useLocalStore } from '@/utils/useLocalStore';


export const useRecipeStore = (documentId: string | undefined) => {
  return useLocalStore(() => new RecipeStore(documentId || ''));
};