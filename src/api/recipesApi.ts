import apiClient  from '@/api/apiClient';
import { Recipe, RecipesResponse } from './recipes';

const PAGE_SIZE = 9; 

export const recipesApi = {
  // Получение одного рецепта по documentId
  getRecipeById: async (documentId: string): Promise<Recipe> => {
    const populateParams = [
      'ingradients',
      'equipments',
      'directions.image',
      'images',
      'category',
    ];

    const queryString = populateParams
      .map((param, index) => `populate[${index}]=${param}`)
      .join('&');

    const response = await apiClient.get<{ data: Recipe }>(
      `/api/recipes/${documentId}?${queryString}`
    );
    
    return response.data.data;
  },

  // Получение списка рецептов с пагинацией
  getRecipes: async (page = 1, pageSize = PAGE_SIZE): Promise<RecipesResponse> => {
    const url = `/api/recipes?populate[0]=images&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    
    const response = await apiClient.get<RecipesResponse>(url);
    return response.data;
  },

  // Получение рецептов с фильтрацией (если нужно)
  getRecipesByCategory: async (categoryId: string, page = 1, pageSize = PAGE_SIZE): Promise<RecipesResponse> => {
    const url = `/api/recipes?filters[category][id][$eq]=${categoryId}&populate[0]=images&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    
    const response = await apiClient.get<RecipesResponse>(url);
    return response.data;
  },

  // Поиск рецептов
  searchRecipes: async (searchTerm: string, page = 1, pageSize = PAGE_SIZE): Promise<RecipesResponse> => {
    const url = `/api/recipes?filters[name][$containsi]=${searchTerm}&populate[0]=images&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    
    const response = await apiClient.get<RecipesResponse>(url);
    return response.data;
  }
};