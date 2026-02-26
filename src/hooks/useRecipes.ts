import { useState, useEffect } from 'react';
import { recipesApi } from '@/api/recipesApi';
import { Recipe } from '@/api/recipes';

const PAGE_SIZE = 9;

export const useRecipes = (initialPage = 1) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await recipesApi.getRecipes(currentPage, PAGE_SIZE);
        
        setRecipes(response.data);
        setTotalRecipes(response.meta.pagination.total);
        setTotalPages(Math.ceil(response.meta.pagination.total / PAGE_SIZE));
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки рецептов');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    recipes,
    loading,
    error,
    currentPage,
    totalPages,
    totalRecipes,
    goToPage,
  };
};