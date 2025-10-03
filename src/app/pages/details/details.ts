import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../shared/interfaces/IProducts';
import { MOCK_PRODUCTS } from '../../shared/data/mock-products';
import { ProductsService } from '../../core/services/products/products-service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private productsService = inject(ProductsService);
  private toastService = inject(ToastService);

  // Product data
  product = signal<IProduct | null>(null);
  quantity = signal<number>(1);
  currentImageIndex = signal<number>(0);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Product images
  productImages = signal<string[]>([]);

  ngOnInit(): void {
    // Get product ID from route params
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.fetchProductDetails(productId);
      } else {
        this.error.set('Product ID not found in URL');
      }
    });
  }

  private fetchProductDetails(productId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productsService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.product.set(product);
          this.productImages.set(
            product.images && product.images.length > 0
              ? [product.productImg, ...product.images]
              : [
                product.productImg,

              ]
          );
        } else {
          this.error.set('Product not found');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.error.set('Failed to load product details. Please try again later.');
        this.isLoading.set(false);
        const foundProduct = MOCK_PRODUCTS.find((p) => p.id === productId);
        if (foundProduct) {
          this.product.set({ ...foundProduct, isNew: foundProduct.isNew ?? false });
          this.productImages.set([
            foundProduct.productImg,
          ]);
        }
      },
    });
  }

  // Carousel methods
  nextImage(): void {
    this.currentImageIndex.update((index) =>
      index === this.productImages().length - 1 ? 0 : index + 1
    );
  }

  prevImage(): void {
    this.currentImageIndex.update((index) =>
      index === 0 ? this.productImages().length - 1 : index - 1
    );
  }

  // Format price in EGY currency
  formatEGYPrice(price: number): string {
    return new Intl.NumberFormat('EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  setImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  // Product interaction methods
  increaseQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update((q) => (q > 1 ? q - 1 : 1));
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product, this.quantity()).subscribe({
        next: () => {
          this.toastService.showToast(`Added ${product.name} to cart`, 'success');
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.toastService.showToast('Failed to add item to cart', 'error');
        }
      });
    }
  }

  toggleWishlist(): void {
    const product = this.product();
    if (product) {
      this.wishlistService.toggleWishlist(product);
    }
  }

  isInWishlist(): boolean {
    const product = this.product();
    return product ? this.wishlistService.isInWishlist(product.id) : false;
  }
}
