import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../shared/interfaces/IProducts';
import { ProductsService } from '../../core/services/products/products-service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products implements OnInit {
  // Product data
  private productsSignal = signal<IProduct[]>([]);
  productService = inject(ProductsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Check for category in URL query params
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        const category = params['category'];
        // Check if the category exists in our list
        if (this.categories().includes(category)) {
          this.selectedCategory.set(category);
        } else if (category === 'New Arrivals' || category === 'Best Sellers') {
          // Handle special categories
          this.selectedCategory.set(category);
        }
      }
    });

    // Fetch products from Supabase
    this.productService.getProducts().subscribe({
      next: (products: IProduct[]) => {
        console.log('Products fetched from Supabase:', products);
        this.productsSignal.set(products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  // Filter states
  categories = signal<string[]>(['All', 'Lip Gloss', 'Lip Balm', 'Accessories']);
  selectedCategory = signal<string>('All');
  sortOption = signal<string>('default');

  // Computed products based on filters
  filteredProducts = computed(() => {
    let filtered = [...this.productsSignal()];

    // Filter by category
    if (this.selectedCategory() !== 'All') {
      filtered = filtered.filter((p) => p.category === this.selectedCategory());
    }

    // Sort products
    switch (this.sortOption()) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'new-arrivals':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'best-sellers':
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
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
  }

  updateSortOption(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption.set(select.value);
  }

  // Helper methods
  formatEGYPrice(price: number): string {
    return new Intl.NumberFormat('EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  addToCart(product: IProduct): void {
    alert('Added to cart: ' + product.name);
    // This would be connected to a cart service in a real implementation
  }
  addToWishlist(product: IProduct): void {
    alert('Added to wishlist: ' + product.name);
    // This would be connected to a wishlist service in a real implementation
  }
}
