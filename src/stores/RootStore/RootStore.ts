import { QueryParamsStore } from './QueryParamsStore/QueryParamsStore';
import { FavoritesStore } from '../FavoritesStore/FavoritesStore';

export class RootStore {
  readonly queryParams: QueryParamsStore;
  readonly favorites: FavoritesStore;

  constructor() {
    this.queryParams = new QueryParamsStore();
    this.favorites = new FavoritesStore();
  }
}