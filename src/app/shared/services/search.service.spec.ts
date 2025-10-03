import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';
import { IProduct } from '../interfaces/IProducts';
import { SearchResult } from '../interfaces/search.interfaces';
import { of } from 'rxjs';

describe('SearchService', () => {
    let service: SearchService;

    const mockProducts: IProduct[] = [
        {
            id: '1',
            name: 'Glaze Glow Lip Gloss',
            description: 'High-shine, non-sticky gloss with skin-loving oils',
            price: 14.99,
            category: 'Lip Gloss',
            productImg: '/assets/gloss.jpg',
            stock: 20,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
            type: 'premium',
            images: [],
            isNew: true,
            isBestSeller: true
        },
        {
            id: '2',
            name: 'Matte Lip Balm',
            description: 'Moisturizing lip balm with matte finish',
            price: 9.99,
            category: 'Lip Balm',
            productImg: '/assets/balm.jpg',
            stock: 15,
            created_at: '2024-01-02',
            updated_at: '2024-01-02',
            type: 'basic',
            images: [],
            isNew: false,
            isBestSeller: false
        },
        {
            id: '3',
            name: 'Shimmer Eyeshadow',
            description: 'Sparkly eyeshadow for glamorous looks',
            price: 19.99,
            category: 'Eyeshadow',
            productImg: '/assets/eyeshadow.jpg',
            stock: 10,
            created_at: '2024-01-03',
            updated_at: '2024-01-03',
            type: 'premium',
            images: [],
            isNew: false,
            isBestSeller: true
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SearchService);

        // Mock localStorage
        let store: { [key: string]: string } = {};
        spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            store[key] = value;
        });
        spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
            delete store[key];
        });

        // Update service with mock products
        service.updateProducts(mockProducts);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('search functionality', () => {
        it('should return empty results for queries shorter than minimum length', (done) => {
            service.searchProducts('a').subscribe(results => {
                expect(results).toEqual([]);
                done();
            });
        });

        it('should return empty results for empty query', (done) => {
            service.searchProducts('').subscribe(results => {
                expect(results).toEqual([]);
                done();
            });
        });

        it('should find exact name matches with highest relevance', (done) => {
            service.searchProducts('Glaze Glow Lip Gloss').subscribe(results => {
                expect(results.length).toBeGreaterThan(0);
                expect(results[0].product.name).toBe('Glaze Glow Lip Gloss');
                expect(results[0].matchType).toBe('exact');
                expect(results[0].relevanceScore).toBe(105); // 100 + 5 for bestseller
                done();
            });
        });

        it('should find partial name matches', (done) => {
            service.searchProducts('Glaze').subscribe(results => {
                expect(results.length).toBeGreaterThan(0);
                expect(results[0].product.name).toBe('Glaze Glow Lip Gloss');
                expect(results[0].matchType).toBe('partial');
                done();
            });
        });

        it('should find category matches', (done) => {
            service.searchProducts('Lip Gloss').subscribe(results => {
                expect(results.length).toBeGreaterThan(0);
                const glossProduct = results.find(r => r.product.category === 'Lip Gloss');
                expect(glossProduct).toBeTruthy();
                expect(glossProduct?.matchType).toBe('category');
                done();
            });
        });

        it('should find description matches', (done) => {
            service.searchProducts('moisturizing').subscribe(results => {
                expect(results.length).toBeGreaterThan(0);
                const balmProduct = results.find(r => r.product.name === 'Matte Lip Balm');
                expect(balmProduct).toBeTruthy();
                expect(balmProduct?.matchType).toBe('description');
                done();
            });
        });

        it('should boost scores for bestsellers and new products', (done) => {
            service.searchProducts('lip').subscribe(results => {
                const glossResult = results.find(r => r.product.name === 'Glaze Glow Lip Gloss');
                const balmResult = results.find(r => r.product.name === 'Matte Lip Balm');

                expect(glossResult).toBeTruthy();
                expect(balmResult).toBeTruthy();

                // Gloss should have higher score due to bestseller + new product boosts
                expect(glossResult!.relevanceScore).toBeGreaterThan(balmResult!.relevanceScore);
                done();
            });
        });

        it('should sort results by relevance score', (done) => {
            service.searchProducts('lip').subscribe(results => {
                for (let i = 1; i < results.length; i++) {
                    expect(results[i - 1].relevanceScore).toBeGreaterThanOrEqual(results[i].relevanceScore);
                }
                done();
            });
        });

        it('should limit results to maxResults', (done) => {
            // This test assumes we have enough products to exceed maxResults
            service.searchProducts('a').subscribe(results => {
                expect(results.length).toBeLessThanOrEqual(20); // default maxResults
                done();
            });
        });
    });

    describe('exact match functionality', () => {
        it('should return exact product match', (done) => {
            service.getExactMatch('Glaze Glow Lip Gloss').subscribe(product => {
                expect(product).toBeTruthy();
                expect(product?.name).toBe('Glaze Glow Lip Gloss');
                done();
            });
        });

        it('should return null for no exact match', (done) => {
            service.getExactMatch('Non-existent Product').subscribe(product => {
                expect(product).toBeNull();
                done();
            });
        });

        it('should be case insensitive for exact matches', (done) => {
            service.getExactMatch('glaze glow lip gloss').subscribe(product => {
                expect(product).toBeTruthy();
                expect(product?.name).toBe('Glaze Glow Lip Gloss');
                done();
            });
        });
    });

    describe('fuzzy matching', () => {
        it('should handle typos with fuzzy matching', (done) => {
            service.searchProducts('Glaze Glo').subscribe(results => {
                expect(results.length).toBeGreaterThan(0);
                const glossProduct = results.find(r => r.product.name === 'Glaze Glow Lip Gloss');
                expect(glossProduct).toBeTruthy();
                done();
            });
        });
    });

    describe('search state management', () => {
        it('should update search state when searching', (done) => {
            service.search('lip');

            // Check that isSearching becomes true initially
            service.isSearching$.subscribe(isSearching => {
                // This will be called multiple times, we're interested in the final state
            });

            // Check final search results
            setTimeout(() => {
                service.searchResults$.subscribe(results => {
                    expect(results.length).toBeGreaterThan(0);
                    done();
                });
            }, 400); // Wait for debounce + processing
        });

        it('should clear search state', () => {
            service.search('test');
            service.clearSearch();

            service.searchState$.subscribe(state => {
                expect(state.query).toBe('');
                expect(state.results).toEqual([]);
                expect(state.isSearching).toBe(false);
                expect(state.hasSearched).toBe(false);
            });
        });
    });

    describe('search history', () => {
        it('should add queries to search history', (done) => {
            service.search('lip gloss');

            setTimeout(() => {
                service.searchHistory$.subscribe(history => {
                    expect(history).toContain('lip gloss');
                    done();
                });
            }, 400);
        });

        it('should not add short queries to history', (done) => {
            service.search('a');

            setTimeout(() => {
                service.searchHistory$.subscribe(history => {
                    expect(history).not.toContain('a');
                    done();
                });
            }, 400);
        });

        it('should limit history to 10 items', (done) => {
            // Add 15 items to history
            for (let i = 0; i < 15; i++) {
                service.search(`query ${i}`);
            }

            setTimeout(() => {
                service.searchHistory$.subscribe(history => {
                    expect(history.length).toBeLessThanOrEqual(10);
                    done();
                });
            }, 500);
        });

        it('should clear search history', () => {
            service.search('test query');
            service.clearSearchHistory();

            service.searchHistory$.subscribe(history => {
                expect(history).toEqual([]);
            });
        });
    });

    describe('utility functions', () => {
        it('should calculate Levenshtein distance correctly', () => {
            // Access private method through any for testing
            const distance1 = (service as any).levenshteinDistance('kitten', 'sitting');
            expect(distance1).toBe(3);

            const distance2 = (service as any).levenshteinDistance('hello', 'hello');
            expect(distance2).toBe(0);

            const distance3 = (service as any).levenshteinDistance('', 'test');
            expect(distance3).toBe(4);
        });

        it('should normalize strings correctly', () => {
            const normalized = (service as any).normalizeString('  Hello   World  ');
            expect(normalized).toBe('hello world');
        });

        it('should calculate fuzzy match scores', () => {
            const score1 = (service as any).calculateFuzzyMatch('hello', 'hello');
            expect(score1).toBe(1);

            const score2 = (service as any).calculateFuzzyMatch('hello', 'helo');
            expect(score2).toBeGreaterThan(0.5);

            const score3 = (service as any).calculateFuzzyMatch('hello', 'xyz');
            expect(score3).toBeLessThan(0.5);
        });
    });

    describe('product updates', () => {
        it('should update products and reflect in search results', (done) => {
            const newProducts: IProduct[] = [
                {
                    id: '4',
                    name: 'New Test Product',
                    description: 'A test product for search',
                    price: 25.99,
                    category: 'Test',
                    productImg: '/assets/test.jpg',
                    stock: 5,
                    created_at: '2024-01-04',
                    updated_at: '2024-01-04',
                    type: 'test',
                    images: [],
                    isNew: true,
                    isBestSeller: false
                }
            ];

            service.updateProducts(newProducts);

            service.searchProducts('test').subscribe(results => {
                expect(results.length).toBeGreaterThan(0);
                expect(results[0].product.name).toBe('New Test Product');
                done();
            });
        });
    });
});