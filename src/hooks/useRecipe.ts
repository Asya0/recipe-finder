import { useState, useEffect } from 'react';
import { recipesApi } from '@/api/recipesApi';
import { Recipe } from '@/api/recipes';

export const useRecipe = (documentId: string | undefined) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await recipesApi.getRecipeById(documentId);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || 'Рецепт не найден');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [documentId]);

  return { recipe, loading, error };
};