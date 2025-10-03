import { IProduct } from './IProducts';

export interface SearchResult {
    product: IProduct;
    relevanceScore: number;
    matchType: 'exact' | 'partial' | 'category' | 'description';
}

export interface SearchConfig {
    maxResults: number;
    enableFuzzySearch: boolean;
    searchFields: (keyof IProduct)[];
    minQueryLength: number;
    debounceTime: number;
}

export interface SearchableProduct extends IProduct {
    searchKeywords?: string[];
    searchScore?: number;
}

export interface SearchState {
    query: string;
    results: SearchResult[];
    isSearching: boolean;
    error: string | null;
    hasSearched: boolean;
}