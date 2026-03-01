import { makeObservable, observable, action, computed } from 'mobx';
import { ILocalStore } from '../ILocalStore';

type PrivateFields = '_params' | '_search' | '_page' | '_filters';

export class QueryParamsStore implements ILocalStore {
  private _params: URLSearchParams;
  private _search: string = '';
  private _page: number = 1;
  private _filters: Record<string, string> = {};

  constructor() {
    this._params = new URLSearchParams(window.location.search);
    this._loadFromParams();
    
    makeObservable<QueryParamsStore, PrivateFields>(this, {
      _params: observable,
      _search: observable,
      _page: observable,
      _filters: observable,
      
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
    return this._filters;
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
    if (value) {
      this._filters[key] = value;
    } else {
      delete this._filters[key];
    }
    this.updateUrl();
  }

  updateUrl(): void {
    const params = new URLSearchParams();
    
    if (this._search) {
      params.set('search', this._search);
    }
    
    if (this._page > 1) {
      params.set('page', this._page.toString());
    }
    
    Object.entries(this._filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
    this._params = params;
  }

  private _loadFromParams(): void {
    this._search = this._params.get('search') || '';
    this._page = parseInt(this._params.get('page') || '1');
    
    const filters: Record<string, string> = {};
    this._params.forEach((value, key) => {
      if (key !== 'search' && key !== 'page') {
        filters[key] = value;
      }
    });
    this._filters = filters;
  }

  destroy(): void {
  }
}