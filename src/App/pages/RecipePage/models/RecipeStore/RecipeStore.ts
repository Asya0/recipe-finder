import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { recipesApi } from '@/api/recipesApi';
import { Recipe } from '@/api/recipes';
import { ILocalStore } from '@/stores/RootStore';

type PrivateFields = '_isLoading' | '_error' | '_recipe' | '_documentId';

export interface RecipeFilter {}

export class RecipeStore implements ILocalStore {
  // что-то наподобие state
  private _recipe: Recipe | null = null;
  private _isLoading: boolean = false;
  private _error: string | null = null;
  private _documentId: string;

  constructor(documentId: string) {
    this._documentId = documentId;

    makeObservable<RecipeStore, PrivateFields>(this, {
      // Приватные поля
      _recipe: observable,
      _isLoading: observable,
      _error: observable,
      _documentId: observable,

      // Геттеры, указываются без _
      recipe: computed,
      error: computed,
      loading: computed,

      // Action
      fetchRecipe: action.bound,
      setDocumentId: action.bound,
    });
    this.fetchRecipe();
  }
  get recipe(): Recipe | null {
    return this._recipe;
  }
  get loading(): boolean {
    return this._isLoading;
  }
  get error(): string | null {
    return this._error;
  }

  // Action
  async fetchRecipe(): Promise<void> {
    if (!this._documentId) return;

    this._isLoading = true;
    this._error = null;

    try {
      const data = await recipesApi.getRecipeById(this._documentId);
      // runInAction для обновления состояния
      runInAction(() => {
        this._recipe = data;
        this._isLoading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this._error = err.message || 'Рецепт не найден';
        this._isLoading = false;
      });
    }
  }

  setDocumentId(newId: string): void {
    if (this._documentId != newId) {
      this._documentId = newId;
      this.fetchRecipe();
    }
  }

  destroy(): void {}
}
