import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockProduct, MOCK_PRODUCTS } from '../../shared/data/mock-products';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Details {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  // Product data
  product = signal<MockProduct | null>(null);
  quantity = signal<number>(1);
  currentImageIndex = signal<number>(0);
  
  // Mock additional product images
  productImages = signal<string[]>([]);

  constructor() {
    // Get product ID from route params
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        // Find product in mock data
        const foundProduct = MOCK_PRODUCTS.find(p => p.id === productId);
        if (foundProduct) {
          this.product.set(foundProduct);
          
          // Create mock additional images based on the main image
          this.productImages.set([
            foundProduct.image_url,
            '/assets/hero section/Picture2.jpg',
            '/assets/hero section/Picture3.jpg',
            '/assets/hero section/Picture4.jpg'
          ]);
        }
      }
    });
  }

  // Carousel methods
  nextImage(): void {
    this.currentImageIndex.update(index => 
      index === this.productImages().length - 1 ? 0 : index + 1
    );
  }

  prevImage(): void {
    this.currentImageIndex.update(index => 
      index === 0 ? this.productImages().length - 1 : index - 1
    );
  }

  setImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  // Product interaction methods
  increaseQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update(q => q > 1 ? q - 1 : 1);
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product, this.quantity());
      alert(`${product.name} added to cart!`);
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
