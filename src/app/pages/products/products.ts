import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../shared/interfaces/IProducts';
import { MOCK_PRODUCTS, MockProduct } from '../../shared/data/mock-products';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  // Product data
  private productsSignal = signal<MockProduct[]>(MOCK_PRODUCTS);

  // Filter states
  categories = signal<string[]>(['All', 'Lip Gloss', 'Lip Balm', 'Accessories']);
  selectedCategory = signal<string>('All');
  priceRange = signal<number>(50);
  sortOption = signal<string>('default');

  // Computed products based on filters
  filteredProducts = computed(() => {
    let filtered = [...this.productsSignal()];

    // Filter by category
    if (this.selectedCategory() !== 'All') {
      filtered = filtered.filter((p) => p.category === this.selectedCategory());
    }

    // Filter by price
    filtered = filtered.filter((p) => p.price <= this.priceRange());

    // Sort products
    switch (this.sortOption()) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'best-sellers':
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'new-arrivals':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    return filtered;
  });

  // Filter methods
  updateCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  updatePriceRange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.priceRange.set(Number(input.value));
  }

  updateSortOption(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption.set(select.value);
  }

  // Helper methods
  getMaxPrice(): number {
    return Math.max(...this.productsSignal().map((p) => p.price));
  }

  addToCart(product: IProduct): void {
    console.log('Added to cart:', product);
    // This would be connected to a cart service in a real implementation
  }
}
