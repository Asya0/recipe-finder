import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { Recipe } from '@/api/recipes';
import apiClient from '@/api/apiClient';
import { ILocalStore } from '../RootStore/ILocalStore';

type PrivateFields = '_favorites' | '_isLoading' | '_error';

interface FavoritesResponse {
  data: Array<{
    id: number;
    recipe: Recipe;
  }>;
}

export class FavoritesStore implements ILocalStore {
  private _favorites: Recipe[] = [];
  private _isLoading: boolean = false;
  private _error: string | null = null;

  constructor() {
    makeObservable<FavoritesStore, PrivateFields>(this, {
      _favorites: observable,
      _isLoading: observable,
      _error: observable,
      
      favorites: computed,
      totalItems: computed,
      isLoading: computed,
      error: computed,
      
      loadFavorites: action.bound,
      addToFavorites: action.bound,
      removeFromFavorites: action.bound,
      clearFavorites: action.bound
    });

    this.loadFavorites();
  }

  get favorites(): Recipe[] {
    return this._favorites;
  }

  get totalItems(): number {
    return this._favorites.length;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  isFavorite(recipeId: number): boolean {
    return this._favorites.some(recipe => recipe.id === recipeId);
  }

  private isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    return !!token;
  }

  async loadFavorites(): Promise<void> {
    if (!this.isAuthenticated()) {
      runInAction(() => {
        this._favorites = [];
        this._isLoading = false;
        this._error = null;
      });
      return;
    }

    this._isLoading = true;
    this._error = null;
    
    try {
      const response = await apiClient.get<FavoritesResponse>('/api/favorites');
      runInAction(() => {
        this._favorites = response.data.data.map(item => item.recipe);
        this._isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        console.error('Failed to load favorites:', error);
        this._error = error instanceof Error ? error.message : 'Failed to load favorites';
        this._isLoading = false;
        this._favorites = [];
      });
    }
  }

  async addToFavorites(recipe: Recipe): Promise<boolean> {
    if (!this.isAuthenticated()) {
      this._error = 'Необходимо авторизоваться';
      return false;
    }

    if (this.isFavorite(recipe.id)) return true;
    
    try {
      await apiClient.post('/api/favorites/add', { recipe: recipe.id });
      runInAction(() => {
        this._favorites.push(recipe);
        this._error = null;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        console.error('Failed to add to favorites:', error);
        this._error = error instanceof Error ? error.message : 'Failed to add to favorites';
      });
      return false;
    }
  }

  async removeFromFavorites(recipeId: number): Promise<boolean> {
    if (!this.isAuthenticated()) {
      this._error = 'Необходимо авторизоваться';
      return false;
    }

    try {
      await apiClient.post('/api/favorites/remove', { recipe: recipeId });
      runInAction(() => {
        this._favorites = this._favorites.filter(recipe => recipe.id !== recipeId);
        this._error = null;
      });
      return true;
    } catch (error) {
      runInAction(() => {
        console.error('Failed to remove from favorites:', error);
        this._error = error instanceof Error ? error.message : 'Failed to remove from favorites';
      });
      return false;
    }
  }

  clearFavorites(): void {
    this._favorites = [];
    this._error = null;
  }

  destroy(): void {
  }
}