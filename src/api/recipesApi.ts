import apiClient from '@/api/apiClient';
import { Recipe, RecipesResponse } from './recipes';

const PAGE_SIZE = 9;

const POPULATE_PARAMS = {
  single: [
    'ingradients',
    'equipments',
    'directions.image',
    'images',
    'category'
  ],
  list: ['images']
};

export const recipesApi = {
  getRecipeById: async (documentId: string): Promise<Recipe> => {
    const populateParams = POPULATE_PARAMS.single
      .map((param, index) => `populate[${index}]=${param}`)
      .join('&');

    const response = await apiClient.get<{ data: Recipe }>(
      `/api/recipes/${documentId}?${populateParams}`
    );
    
    return response.data.data;
  },

  getRecipes: async (page = 1, pageSize = PAGE_SIZE): Promise<RecipesResponse> => {
    const populateParams = POPULATE_PARAMS.list
      .map((param, index) => `populate[${index}]=${param}`)
      .join('&');
    
    const url = `/api/recipes?${populateParams}&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    
    const response = await apiClient.get<RecipesResponse>(url);
    return response.data;
  },

  getRecipesByCategory: async (categoryId: string, page = 1, pageSize = PAGE_SIZE): Promise<RecipesResponse> => {
    const populateParams = POPULATE_PARAMS.list
      .map((param, index) => `populate[${index}]=${param}`)
      .join('&');
    
    const url = `/api/recipes?filters[category][id][$eq]=${categoryId}&${populateParams}&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    
    const response = await apiClient.get<RecipesResponse>(url);
    return response.data;
  },

  searchRecipes: async (searchTerm: string, page = 1, pageSize = PAGE_SIZE): Promise<RecipesResponse> => {
    const populateParams = POPULATE_PARAMS.list
      .map((param, index) => `populate[${index}]=${param}`)
      .join('&');
    
    const url = `/api/recipes?filters[name][$containsi]=${encodeURIComponent(searchTerm)}&${populateParams}&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    
    const response = await apiClient.get<RecipesResponse>(url);
    return response.data;
  },

  getRecipesWithFilters: async (
    filters: {
      categoryId?: string;
      vegetarian?: boolean;
      minRating?: number;
      maxTime?: number;
    },
    page = 1,
    pageSize = PAGE_SIZE
  ): Promise<RecipesResponse> => {
    const populateParams = POPULATE_PARAMS.list
      .map((param, index) => `populate[${index}]=${param}`)
      .join('&');
    
    const filterParams: string[] = [];
    
    if (filters.categoryId) {
      filterParams.push(`filters[category][id][$eq]=${filters.categoryId}`);
    }
    
    if (filters.vegetarian !== undefined) {
      filterParams.push(`filters[vegetarian][$eq]=${filters.vegetarian}`);
    }
    
    if (filters.minRating && filters.minRating > 0) {
      filterParams.push(`filters[rating][$gte]=${filters.minRating}`);
    }
    
    if (filters.maxTime && filters.maxTime > 0) {
      filterParams.push(`filters[totalTime][$lte]=${filters.maxTime}`);
    }
    
    const filterString = filterParams.join('&');
    const url = `/api/recipes?${filterString}${filterString ? '&' : ''}${populateParams}&pagination[pageSize]=${pageSize}&pagination[page]=${page}`;
    
    const response = await apiClient.get<RecipesResponse>(url);
    return response.data;
  }
};