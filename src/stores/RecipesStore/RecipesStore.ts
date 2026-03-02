import {
  makeObservable,
  observable,
  action,
  computed,
  reaction,
  IReactionDisposer,
  runInAction,
} from 'mobx';
import { recipesApi } from '@/api/recipesApi';
import { Recipe, RecipesResponse } from '@/api/recipes';
import { ILocalStore } from '../RootStore/ILocalStore';
import { QueryParamsStore } from '../RootStore/QueryParamsStore/QueryParamsStore';

type PrivateFields =
  | '_recipes'
  | '_filteredRecipes'
  | '_isLoading'
  | '_error'
  | '_totalPages'
  | '_totalItems'
  | '_pageSize'
  | '_queryParams';

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
    });

    this._searchReactionDisposer = reaction(
      () => [this._queryParams.search, this._queryParams.page],
      () => {
        this.fetchRecipes();
      }
    );

    this._filterReactionDisposer = reaction(
      () => ({
        category: this._queryParams.filters.category,
        vegetarian: this._queryParams.filters.vegetarian,
        minRating: this._queryParams.filters.minRating,
        maxTime: this._queryParams.filters.maxTime,
      }),
      () => {
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
      const searchTerm = this._queryParams.search;
      const page = this._queryParams.page;
      const filters = this._queryParams.filters;


      let response: RecipesResponse;

      if (searchTerm) {
        response = await recipesApi.searchRecipes(searchTerm, page, this._pageSize);
      } else {
        const filterParams: any = {};

        if (filters.category) {
          filterParams.category = {
            id: {
              $eq: Number(filters.category),
            },
          };
        }

        if (filters.vegetarian === 'true') {
          filterParams.vegetarian = {
            $eq: true,
          };
        }

        if (filters.minRating && Number(filters.minRating) > 0) {
          filterParams.rating = {
            $gte: Number(filters.minRating),
          };
        }

        if (filters.maxTime && Number(filters.maxTime) > 0) {
          filterParams.totalTime = {
            $lte: Number(filters.maxTime),
          };
        }

        response = await recipesApi.getRecipes(page, this._pageSize, filterParams);
      }

      runInAction(() => {
        this._recipes = response.data;
        this._filteredRecipes = response.data;
        this._totalItems = response.meta.pagination.total;
        this._totalPages = Math.ceil(this._totalItems / this._pageSize);
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

    let stringValue = '';

    if (key === 'vegetarian') {
      stringValue = value ? 'true' : 'false';
    } else {
      stringValue = value?.toString() || '';
    }

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
    if (this._queryParams.page !== 1) {
      this._queryParams.setPage(1);
    }
  }

  destroy(): void {
    this._searchReactionDisposer();
    this._filterReactionDisposer();
  }
}
