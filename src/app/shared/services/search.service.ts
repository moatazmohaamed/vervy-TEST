import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    switchMap,
    map,
    catchError,
    tap,
    startWith
} from 'rxjs/operators';
import { IProduct } from '../interfaces/IProducts';
import {
    SearchResult,
    SearchConfig,
    SearchableProduct,
    SearchState
} from '../interfaces/search.interfaces';
import { MOCK_PRODUCTS } from '../data/mock-products';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly defaultConfig: SearchConfig = {
        maxResults: 20,
        enableFuzzySearch: true,
        searchFields: ['name', 'description', 'category', 'type'],
        minQueryLength: 2,
        debounceTime: 300
    };

    private searchQuerySubject = new BehaviorSubject<string>('');
    private searchStateSubject = new BehaviorSubject<SearchState>({
        query: '',
        results: [],
        isSearching: false,
        error: null,
        hasSearched: false
    });

    private searchHistorySubject = new BehaviorSubject<string[]>([]);
    private products: IProduct[] = MOCK_PRODUCTS as IProduct[];

    // Public observables
    public readonly searchQuery$ = this.searchQuerySubject.asObservable();
    public readonly searchState$ = this.searchStateSubject.asObservable();
    public readonly searchHistory$ = this.searchHistorySubject.asObservable();
    public readonly isSearching$ = this.searchState$.pipe(map(state => state.isSearching));
    public readonly searchResults$ = this.searchState$.pipe(map(state => state.results));

    constructor() {
        this.initializeSearch();
        this.loadSearchHistory();
    }

    private initializeSearch(): void {
        this.searchQuery$.pipe(
            debounceTime(this.defaultConfig.debounceTime),
            distinctUntilChanged(),
            tap(query => this.updateSearchState({ query, isSearching: true, error: null })),
            switchMap(query => this.performSearch(query)),
            catchError(error => {
                this.updateSearchState({
                    isSearching: false,
                    error: 'Search failed. Please try again.'
                });
                return of([]);
            })
        ).subscribe(results => {
            this.updateSearchState({
                results,
                isSearching: false,
                hasSearched: true
            });
        });
    }

    public search(query: string): void {
        this.searchQuerySubject.next(query.trim());
    }

    public searchProducts(query: string): Observable<SearchResult[]> {
        if (!query || query.length < this.defaultConfig.minQueryLength) {
            return of([]);
        }

        return this.performSearch(query);
    }

    public getExactMatch(query: string): Observable<IProduct | null> {
        const normalizedQuery = this.normalizeString(query);
        const exactMatch = this.products.find(product =>
            this.normalizeString(product.name) === normalizedQuery
        );
        return of(exactMatch || null);
    }

    private performSearch(query: string): Observable<SearchResult[]> {
        if (!query || query.length < this.defaultConfig.minQueryLength) {
            return of([]);
        }

        const normalizedQuery = this.normalizeString(query);
        const searchResults: SearchResult[] = [];

        // Add to search history
        this.addToSearchHistory(query);

        for (const product of this.products) {
            const result = this.calculateRelevance(product, normalizedQuery);
            if (result) {
                searchResults.push(result);
            }
        }

        // Sort by relevance score (highest first)
        searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

        return of(searchResults.slice(0, this.defaultConfig.maxResults));
    }

    private calculateRelevance(product: IProduct, normalizedQuery: string): SearchResult | null {
        let relevanceScore = 0;
        let matchType: SearchResult['matchType'] = 'partial';

        const normalizedName = this.normalizeString(product.name);
        const normalizedDescription = this.normalizeString(product.description);
        const normalizedCategory = this.normalizeString(product.category);
        const normalizedType = this.normalizeString(product.type);

        // Exact name match (highest priority)
        if (normalizedName === normalizedQuery) {
            relevanceScore = 100;
            matchType = 'exact';
        }
        // Name starts with query
        else if (normalizedName.startsWith(normalizedQuery)) {
            relevanceScore = 90;
            matchType = 'partial';
        }
        // Name contains query
        else if (normalizedName.includes(normalizedQuery)) {
            relevanceScore = 80;
            matchType = 'partial';
        }
        // Category exact match
        else if (normalizedCategory === normalizedQuery) {
            relevanceScore = 70;
            matchType = 'category';
        }
        // Category contains query
        else if (normalizedCategory.includes(normalizedQuery)) {
            relevanceScore = 60;
            matchType = 'category';
        }
        // Type match
        else if (normalizedType.includes(normalizedQuery)) {
            relevanceScore = 50;
            matchType = 'category';
        }
        // Description contains query
        else if (normalizedDescription.includes(normalizedQuery)) {
            relevanceScore = 40;
            matchType = 'description';
        }


        // Boost score for popular products
        if (product.isBestSeller) {
            relevanceScore += 5;
        }
        if (product.isNew) {
            relevanceScore += 3;
        }

        return relevanceScore > 0 ? {
            product,
            relevanceScore,
            matchType
        } : null;
    }



    private normalizeString(str: string): string {
        return str.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    private updateSearchState(partialState: Partial<SearchState>): void {
        const currentState = this.searchStateSubject.value;
        this.searchStateSubject.next({ ...currentState, ...partialState });
    }

    private addToSearchHistory(query: string): void {
        if (!query || query.length < this.defaultConfig.minQueryLength) {
            return;
        }

        const currentHistory = this.searchHistorySubject.value;
        const updatedHistory = [query, ...currentHistory.filter(h => h !== query)].slice(0, 10);
        this.searchHistorySubject.next(updatedHistory);
        this.saveSearchHistory(updatedHistory);
    }

    private loadSearchHistory(): void {
        try {
            const saved = localStorage.getItem('search-history');
            if (saved) {
                const history = JSON.parse(saved);
                this.searchHistorySubject.next(history);
            }
        } catch (error) {
            console.warn('Failed to load search history:', error);
        }
    }

    private saveSearchHistory(history: string[]): void {
        try {
            localStorage.setItem('search-history', JSON.stringify(history));
        } catch (error) {
            console.warn('Failed to save search history:', error);
        }
    }

    public clearSearchHistory(): void {
        this.searchHistorySubject.next([]);
        localStorage.removeItem('search-history');
    }

    public clearSearch(): void {
        this.searchQuerySubject.next('');
        this.updateSearchState({
            query: '',
            results: [],
            isSearching: false,
            error: null,
            hasSearched: false
        });
    }

    public updateProducts(products: IProduct[]): void {
        this.products = products;
    }
}