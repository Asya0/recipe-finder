import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { ILocalStore } from '../RootStore/ILocalStore';
import { Recipe } from '@/api/recipes';
import { recipesApi } from '@/api/recipesApi';

type PrivateFields = '_favoriteIds' | '_favoriteRecipes' | '_isLoading' | '_error';

const FAVORITE_IDS_KEY = 'favorite_ids';

export class FavoritesStore implements ILocalStore {
  private _favoriteIds: string[] = [];
  private _favoriteRecipes: Recipe[] = [];
  private _isLoading: boolean = false;
  private _error: string | null = null;

  constructor() {
    makeObservable<FavoritesStore, PrivateFields>(this, {
      _favoriteIds: observable,
      _favoriteRecipes: observable,
      _isLoading: observable,
      _error: observable,

      favoriteIds: computed,
      favoriteRecipes: computed,
      savedRecipes: computed,
      isLoading: computed,
      error: computed,
      savedCount: computed,

      toggleSave: action.bound,
      removeFavorite: action.bound,
      addFavorite: action.bound,
      isSaved: action.bound,
      loadFromStorage: action.bound,
      fetchFavoriteRecipes: action.bound,
      clearAll: action.bound,
    });

    this.loadFromStorage();
    this.fetchFavoriteRecipes();
  }

  get favoriteIds(): string[] {
    return this._favoriteIds;
  }

  get favoriteRecipes(): Recipe[] {
    return this._favoriteRecipes;
  }

  get savedRecipes(): Recipe[] {
    return this._favoriteRecipes;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  get savedCount(): number {
    return this._favoriteIds.length;
  }

  isSaved(recipeId: number | string): boolean {
    const idStr = String(recipeId);
    return this._favoriteIds.some((id) => id === idStr);
  }

  async toggleSave(recipe: Recipe): Promise<void> {
    const recipeId = recipe.documentId || String(recipe.id);

    if (this.isSaved(recipeId)) {
      await this.removeFavorite(recipeId);
    } else {
      await this.addFavorite(recipeId);
    }
  }

  async addFavorite(recipeId: string): Promise<void> {
    runInAction(() => {
      if (!this._favoriteIds.includes(recipeId)) {
        this._favoriteIds.push(recipeId);
        this._saveToStorage();
      }
    });

    if (
      !this._favoriteRecipes.some((r) => r.documentId === recipeId || String(r.id) === recipeId)
    ) {
      await this.fetchFavoriteRecipes();
    }
  }

  async removeFavorite(recipeId: string): Promise<void> {
    runInAction(() => {
      this._favoriteIds = this._favoriteIds.filter((id) => id !== recipeId);
      this._favoriteRecipes = this._favoriteRecipes.filter(
        (r) => r.documentId !== recipeId && String(r.id) !== recipeId
      );
      this._saveToStorage();
    });
  }

  async fetchFavoriteRecipes(): Promise<void> {
    if (this._favoriteIds.length === 0) {
      runInAction(() => {
        this._favoriteRecipes = [];
        this._isLoading = false;
      });
      return;
    }

    this._isLoading = true;
    this._error = null;

    try {
      const response = await recipesApi.getRecipes(1, 100, {
        documentId: {
          $in: this._favoriteIds,
        },
      });

      runInAction(() => {
        this._favoriteRecipes = response.data;
        this._isLoading = false;
      });
    } catch (error) {
      console.error('Failed to fetch favorite recipes:', error);

      try {
        const recipes: Recipe[] = [];
        for (const id of this._favoriteIds) {
          try {
            const recipe = await recipesApi.getRecipeById(id);
            recipes.push(recipe);
          } catch (e) {
            console.error(`Failed to fetch recipe ${id}:`, e);
          }
        }

        runInAction(() => {
          this._favoriteRecipes = recipes;
          this._isLoading = false;
        });
      } catch (fallbackError) {
        runInAction(() => {
          this._error = 'Не удалось загрузить сохраненные рецепты';
          this._isLoading = false;
        });
      }
    }
  }

  private _saveToStorage(): void {
    try {
      localStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify(this._favoriteIds));
    } catch (error) {
      console.error('Failed to save favorite IDs to localStorage:', error);
    }
  }

  loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(FAVORITE_IDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        runInAction(() => {
          this._favoriteIds = Array.isArray(parsed) ? parsed : [];
        });
      }
    } catch (error) {
      console.error('Failed to load favorite IDs from localStorage:', error);
      runInAction(() => {
        this._favoriteIds = [];
      });
    }
  }

  clearAll(): void {
    runInAction(() => {
      this._favoriteIds = [];
      this._favoriteRecipes = [];
      this._saveToStorage();
    });
  }

  destroy(): void {}
}
