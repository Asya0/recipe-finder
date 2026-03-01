import { QueryParamsStore } from './QueryParamsStore/QueryParamsStore';
import { RecipesStore } from '../RecipesStore/RecipesStore';
import { FavoritesStore } from '../FavoritesStore/FavoritesStore';

export class RootStore {
  readonly queryParams: QueryParamsStore;
  readonly recipes: RecipesStore;
  readonly favorites: FavoritesStore;

  constructor() {
    this.queryParams = new QueryParamsStore();
    this.recipes = new RecipesStore(this.queryParams);
    this.favorites = new FavoritesStore();
  }
}