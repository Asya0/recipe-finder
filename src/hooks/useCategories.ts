import { useState, useEffect } from 'react';
import { mealCategoriesApi } from '@/api/mealCategoriesApi';
import { Option } from '@/components';

export const useCategories = () => {
  const [categories, setCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await mealCategoriesApi.getCategories();
        
        const options: Option[] = data.map((cat) => {
          
          return {
            key: String(cat.id),
            value: cat.title,
          };
        });
        
        setCategories(options);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке категорий');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};