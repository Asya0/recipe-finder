import { makeObservable, observable, action, computed } from 'mobx';
import { ILocalStore } from '../ILocalStore';

type PrivateFields = '_params' | '_search' | '_page' | '_category' | '_vegetarian' | '_minRating' | '_maxTime';

export class QueryParamsStore implements ILocalStore {
  private _params: URLSearchParams;
  private _search: string = '';
  private _page: number = 1;
  
  private _category: string = '';
  private _vegetarian: string = ''; 
  private _minRating: string = '';
  private _maxTime: string = '';

  constructor() {
    this._params = new URLSearchParams(window.location.search);
    this._loadFromParams();
    
    makeObservable<QueryParamsStore, PrivateFields>(this, {
      _params: observable,
      _search: observable,
      _page: observable,
      _category: observable,
      _vegetarian: observable,
      _minRating: observable,
      _maxTime: observable,
      
      search: computed,
      page: computed,
      filters: computed,
      
      setSearch: action.bound,
      setPage: action.bound,
      setFilter: action.bound,
      updateUrl: action.bound,
    });
  }

  get search(): string {
    return this._search;
  }

  get page(): number {
    return this._page;
  }

  get filters(): Record<string, string> {
    const filters: Record<string, string> = {};
    
    if (this._category) filters.category = this._category;
    if (this._vegetarian) filters.vegetarian = this._vegetarian;
    if (this._minRating) filters.minRating = this._minRating;
    if (this._maxTime) filters.maxTime = this._maxTime;
    
    return filters;
  }

  get isVegetarian(): boolean {
    return this._vegetarian === 'true';
  }

  setSearch(value: string): void {
    this._search = value;
    this.updateUrl();
  }

  setPage(value: number): void {
    this._page = value;
    this.updateUrl();
  }

  setFilter(key: string, value: string): void {
    
    switch (key) {
      case 'category':
        this._category = value;
        break;
      case 'vegetarian':
        this._vegetarian = value;
        break;
      case 'minRating':
        this._minRating = value;
        break;
      case 'maxTime':
        this._maxTime = value;
        break;
      default:
        console.warn(`Unknown filter key: ${key}`);
    }
    
    this.updateUrl();
  }

  setVegetarian(checked: boolean): void {
    this.setFilter('vegetarian', checked ? 'true' : '');
  }

  updateUrl(): void {
    const params = new URLSearchParams();
    
    if (this._search) {
      params.set('search', this._search);
    }
    
    if (this._page > 1) {
      params.set('page', this._page.toString());
    }
    
    if (this._category) params.set('category', this._category);
    
    if (this._vegetarian === 'true') {
      params.set('vegetarian', 'true');
    }
    
    if (this._minRating) params.set('minRating', this._minRating);
    if (this._maxTime) params.set('maxTime', this._maxTime);
    
    const queryString = params.toString();
    const newUrl = `${window.location.pathname}${queryString ? '?' + queryString : ''}`;
    
    window.history.replaceState({}, '', newUrl);
    this._params = params;
    
  }

  private _loadFromParams(): void {
    this._search = this._params.get('search') || '';
    this._page = parseInt(this._params.get('page') || '1', 10);
    
    this._category = this._params.get('category') || '';
    this._vegetarian = this._params.get('vegetarian') || '';
    this._minRating = this._params.get('minRating') || '';
    this._maxTime = this._params.get('maxTime') || '';
    
  }

  destroy(): void {
  }
}