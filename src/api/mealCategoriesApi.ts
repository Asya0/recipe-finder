import apiClient from '@/api/apiClient';
import { MealCategory } from '@/types/meal-category';
import qs from 'qs';

export const mealCategoriesApi = {
  getCategories: async (): Promise<MealCategory[]> => {
    
    const params = {
      populate: '*',
      pagination: {
        pageSize: 100,
      },
    };
    
    const queryString = qs.stringify(params, {
      encodeValuesOnly: true,
    });
    
    const url = `/api/meal-categories?${queryString}`;
    
    try {
      const response = await apiClient.get(url);
      
      return response.data.data;
    } catch (error) {
      console.debug('❌ Ошибка запроса:', error);
      throw error;
    }
  },
};