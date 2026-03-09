import apiClient from '@/api/apiClient';
import { Recipe, RecipesResponse } from './recipes';

const PAGE_SIZE = 9;

const POPULATE_PARAMS = {
  single: ['ingradients', 'equipments', 'directions.image', 'images', 'category'],
  list: ['images'],
};

export const recipesApi = {
  getRecipeById: async (documentId: string): Promise<Recipe> => {
    const response = await apiClient.get<{ data: Recipe }>(`/api/recipes/${documentId}`, {
      params: {
        populate: POPULATE_PARAMS.single,
      },
    });
    return response.data.data;
  },

  getRecipes: async (
    page: number = 1,
    pageSize: number = PAGE_SIZE,
    filters?: any
  ): Promise<RecipesResponse> => {
    const params: any = {
      populate: POPULATE_PARAMS.list,
      pagination: {
        page,
        pageSize,
      },
    };

    if (filters) {
      params.filters = filters;
    }

    const response = await apiClient.get<RecipesResponse>('/api/recipes', { params });
    return response.data;
  },

  getRecipesByIds: async (ids: string[], page = 1, pageSize = 100): Promise<RecipesResponse> => {
    const params = {
      populate: POPULATE_PARAMS.list,
      pagination: {
        page,
        pageSize,
      },
      filters: {
        documentId: {
          $in: ids,
        },
      },
    };

    const response = await apiClient.get<RecipesResponse>('/api/recipes', { params });
    return response.data;
  },

  searchRecipes: async (
    searchTerm: string,
    page = 1,
    pageSize = PAGE_SIZE
  ): Promise<RecipesResponse> => {
    const params = {
      populate: POPULATE_PARAMS.list,
      pagination: {
        page,
        pageSize,
      },
      filters: {
        name: {
          $containsi: searchTerm,
        },
      },
    };

    const response = await apiClient.get<RecipesResponse>('/api/recipes', { params });
    return response.data;
  },
};
