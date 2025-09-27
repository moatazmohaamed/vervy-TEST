import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockProduct } from '../../shared/data/mock-products';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Wishlist {
  // Inject the wishlist service
  private wishlistService = inject(WishlistService);
  
  // Get wishlist items from service
  wishlistItems = this.wishlistService.getWishlistItems();
  
  // Computed properties
  wishlistTotal = computed(() => {
    return this.wishlistItems().reduce((total, item) => total + item.price, 0);
  });

  // Methods
  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  addToCart(product: MockProduct): void {
    // This would normally add to cart service
    console.log('Added to cart:', product);
    // Show a dummy alert
    alert(`${product.name} added to cart!`);
    
    // Optionally remove from wishlist after adding to cart
    // this.removeFromWishlist(product.id);
  }
}
