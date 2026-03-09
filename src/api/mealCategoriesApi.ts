import apiClient from '@/api/apiClient';
import { MealCategory } from '@/types/meal-category';

export const mealCategoriesApi = {
  getCategories: async (): Promise<MealCategory[]> => {
    const params = {
      populate: '*',
      pagination: {
        pageSize: 100,
      },
      sort: 'title:asc',
    };
    
    const response = await apiClient.get('/api/meal-categories', { params });
    return response.data.data;
  },

  getCategoryById: async (id: string): Promise<MealCategory> => {
    const response = await apiClient.get(`/api/meal-categories/${id}`, {
      params: {
        populate: '*',
      }
    });
    return response.data.data;
  }
};