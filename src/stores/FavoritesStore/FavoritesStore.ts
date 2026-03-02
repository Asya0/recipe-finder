import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { ILocalStore } from '../RootStore/ILocalStore';
import { Recipe } from '@/api/recipes';

type PrivateFields = '_savedRecipes' | '_isLoading' | '_error';

const SAVED_RECIPES_KEY = 'favorites';

export class FavoritesStore implements ILocalStore {
  private _savedRecipes: Recipe[] = [];
  private _isLoading: boolean = false;
  private _error: string | null = null;

  constructor() {
    makeObservable<FavoritesStore, PrivateFields>(this, {
      _savedRecipes: observable,
      _isLoading: observable,
      _error: observable,

      savedRecipes: computed,
      isLoading: computed,
      error: computed,
      savedCount: computed,

      saveRecipe: action.bound,
      removeRecipe: action.bound,
      toggleSave: action.bound,
      isSaved: action.bound,
      loadFromStorage: action.bound,
      clearAll: action.bound,
    });

    this.loadFromStorage();
  }

  get savedRecipes(): Recipe[] {
    return this._savedRecipes;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  get savedCount(): number {
    return this._savedRecipes.length;
  }

  isSaved(recipeId: number | string): boolean {
    return this._savedRecipes.some(
      recipe => recipe.id === recipeId || recipe.documentId === recipeId
    );
  }

  saveRecipe(recipe: Recipe): void {
    if (!this.isSaved(recipe.id)) {
      runInAction(() => {
        this._savedRecipes.push(recipe);
        this._saveToStorage();
      });
    }
  }

  removeRecipe(recipeId: number | string): void {
    runInAction(() => {
      this._savedRecipes = this._savedRecipes.filter(
        recipe => recipe.id !== recipeId && recipe.documentId !== recipeId
      );
      this._saveToStorage();
    });
  }

  toggleSave(recipe: Recipe): void {
    if (this.isSaved(recipe.id)) {
      this.removeRecipe(recipe.id);
    } else {
      this.saveRecipe(recipe);
    }
  }

  clearAll(): void {
    runInAction(() => {
      this._savedRecipes = [];
      this._saveToStorage();
    });
  }

  private _saveToStorage(): void {
    try {
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(this._savedRecipes));
    } catch (error) {
      console.error('Failed to save recipes to localStorage:', error);
      this._error = 'Не удалось сохранить рецепты';
    }
  }

  loadFromStorage(): void {
    this._isLoading = true;
    
    try {
      const saved = localStorage.getItem(SAVED_RECIPES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        runInAction(() => {
          this._savedRecipes = parsed;
          this._error = null;
        });
      } else {
        runInAction(() => {
          this._savedRecipes = [];
          this._error = null;
        });
      }
    } catch (error) {
      console.error('Failed to load recipes from localStorage:', error);
      runInAction(() => {
        this._error = 'Не удалось загрузить сохраненные рецепты';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  destroy(): void {
  }
}