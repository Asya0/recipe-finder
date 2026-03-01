import { makeObservable, observable, action, computed, reaction, IReactionDisposer, runInAction } from 'mobx';
import { recipesApi } from '@/api/recipesApi';
import { Recipe, RecipesResponse } from '@/api/recipes';
import { ILocalStore } from '../RootStore/ILocalStore';
import { QueryParamsStore } from '../RootStore/QueryParamsStore/QueryParamsStore';

type PrivateFields = '_recipes' | '_filteredRecipes' | '_isLoading' | '_error' 
  | '_totalPages' | '_totalItems' | '_pageSize' | '_queryParams' | '_applyLocalFilters';

export interface RecipesFilter {
  vegetarian?: boolean | null;
  minRating?: number;
  maxTotalTime?: number | null;
  categoryId?: string | null;
}

export class RecipesStore implements ILocalStore {
  private _recipes: Recipe[] = [];
  private _filteredRecipes: Recipe[] = [];
  private _isLoading: boolean = false;
  private _error: string | null = null;
  private _totalPages: number = 0;
  private _totalItems: number = 0;
  private _pageSize: number = 9;
  private _queryParams: QueryParamsStore;
  
  private readonly _searchReactionDisposer: IReactionDisposer;
  private readonly _filterReactionDisposer: IReactionDisposer;
  // private readonly _debounceTimeout: NodeJS.Timeout | null = null;

  constructor(queryParams: QueryParamsStore) {
    this._queryParams = queryParams;
    
    makeObservable<RecipesStore, PrivateFields>(this, {
      _recipes: observable,
      _filteredRecipes: observable,
      _isLoading: observable,
      _error: observable,
      _totalPages: observable,
      _totalItems: observable,
      _pageSize: observable,
      _queryParams: observable,
      
      recipes: computed,
      filteredRecipes: computed,
      isLoading: computed,
      error: computed,
      totalPages: computed,
      totalItems: computed,
      searchQuery: computed,
      filters: computed,
      currentPage: computed,
      
      fetchRecipes: action.bound,
      setFilter: action.bound,
      clearFilters: action.bound,
      setPage: action.bound,
      setSearchQuery: action.bound,
      
      _applyLocalFilters: action.bound
    });

    this._searchReactionDisposer = reaction(
      () => [this._queryParams.search, this._queryParams.page],
      () => {
        console.log('Поиск/пагинация изменились', {
          search: this._queryParams.search,
          page: this._queryParams.page,
          filters: this._queryParams.filters
        });
        this.fetchRecipes();
      }
    );

    this._filterReactionDisposer = reaction(
      () => ({
        category: this._queryParams.filters.category,
        vegetarian: this._queryParams.filters.vegetarian,
        minRating: this._queryParams.filters.minRating,
        maxTime: this._queryParams.filters.maxTime
      }),
      () => {
        console.log('Фильтры изменились', {
          filters: this._queryParams.filters
        });
        if (this._queryParams.page !== 1) {
          this._queryParams.setPage(1);
        } else {
          this.fetchRecipes();
        }
      }
    );

    this.fetchRecipes();
  }

  get recipes(): Recipe[] {
    return this._recipes;
  }

  get filteredRecipes(): Recipe[] {
    return this._filteredRecipes;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  get totalPages(): number {
    return this._totalPages;
  }

  get totalItems(): number {
    return this._totalItems;
  }

  get searchQuery(): string {
    return this._queryParams.search;
  }

  get currentPage(): number {
    return this._queryParams.page;
  }

  get filters(): RecipesFilter {
    const { vegetarian, minRating, maxTime, category } = this._queryParams.filters;
    return {
      vegetarian: vegetarian === 'true' ? true : vegetarian === 'false' ? false : null,
      minRating: minRating ? Number(minRating) : 0,
      maxTotalTime: maxTime ? Number(maxTime) : null,
      categoryId: category || null
    };
  }

  getRecipeImageUrl(recipe: Recipe): string {
    if (recipe.images && recipe.images.length > 0) {
      const image = recipe.images[0];
      if (image.formats) {
        return image.formats.small?.url || image.formats.thumbnail?.url || image.url;
      }
      return image.url;
    }
    return '/placeholder.jpg';
  }

  async fetchRecipes(): Promise<void> {
    this._isLoading = true;
    this._error = null;

    try {
      let response: RecipesResponse;
      const searchTerm = this._queryParams.search;
      const page = this._queryParams.page;
      const filters = this._queryParams.filters;

      if (searchTerm) {
        response = await recipesApi.searchRecipes(searchTerm, page, this._pageSize);
      } 
      else if (filters.category) {
        response = await recipesApi.getRecipesByCategory(filters.category, page, this._pageSize);
      } 
      else {
        response = await recipesApi.getRecipes(page, this._pageSize);
      }
      
      runInAction(() => {
        this._recipes = response.data;
        this._totalItems = response.meta.pagination.total;
        this._totalPages = Math.ceil(this._totalItems / this._pageSize);
        this._applyLocalFilters();
        this._isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Unknown error';
        this._isLoading = false;
      });
    }
  }

  setFilter<K extends keyof RecipesFilter>(key: K, value: RecipesFilter[K]): void {
    const stringValue = value?.toString() || '';
    
    switch (key) {
      case 'vegetarian':
        this._queryParams.setFilter('vegetarian', stringValue);
        break;
      case 'minRating':
        this._queryParams.setFilter('minRating', stringValue);
        break;
      case 'maxTotalTime':
        this._queryParams.setFilter('maxTime', stringValue);
        break;
      case 'categoryId':
        this._queryParams.setFilter('category', stringValue);
        break;
    }
  }

  setPage(page: number): void {
    this._queryParams.setPage(page);
  }

  setSearchQuery(query: string): void {
    if (this._queryParams.page !== 1) {
      this._queryParams.setPage(1);
    }
    this._queryParams.setSearch(query);
  }

  clearFilters(): void {
    this._queryParams.setFilter('vegetarian', '');
    this._queryParams.setFilter('minRating', '');
    this._queryParams.setFilter('maxTime', '');
    this._queryParams.setFilter('category', '');
    
    // this._queryParams.setSearch('');
    
    if (this._queryParams.page !== 1) {
      this._queryParams.setPage(1);
    }
  }

  private _applyLocalFilters(): void {
    let filtered = [...this._recipes];
    const { vegetarian, minRating, maxTotalTime } = this.filters;

    if (vegetarian !== null) {
      filtered = filtered.filter(recipe => recipe.vegetarian === vegetarian);
    }

    if (minRating && minRating > 0) {
      filtered = filtered.filter(recipe => (recipe.rating || 0) >= minRating);
    }

    if (maxTotalTime && maxTotalTime > 0) {
      filtered = filtered.filter(recipe => (recipe.totalTime || 0) <= maxTotalTime);
    }

    this._filteredRecipes = filtered;
  }

  destroy(): void {
    this._searchReactionDisposer();
    this._filterReactionDisposer();
  }
}