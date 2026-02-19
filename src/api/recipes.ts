import apiClient from './apiClient';

export interface Recipe {
  id: number;
  documentId: string;
  name: string;
  summary: string;
  totalTime: number;
  cookingTime: number;
  preparationTime: number;
  servings: number;
  rating: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  likes: number;
  vegetarian: boolean;
}
