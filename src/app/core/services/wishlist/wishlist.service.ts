import { Injectable, signal } from '@angular/core';
import { MOCK_WISHLIST_ITEMS } from '../../../shared/data/mock-wishlist';
import { IProduct } from '../../../shared/interfaces/IProducts';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  // Wishlist data as a signal
  private wishlistItems = signal<IProduct[]>([]);

  // Methods to get wishlist items
  getWishlistItems() {
    return this.wishlistItems;
  }

  // Add item to wishlist
  addToWishlist(product: IProduct): void {
    // Check if product already exists in wishlist
    if (!this.isInWishlist(product.id)) {
      this.wishlistItems.update((items) => [...items, product]);
    }
  }

  // Remove item from wishlist
  removeFromWishlist(productId: string): void {
    this.wishlistItems.update((items) => items.filter((item) => item.id !== productId));
  }

  // Check if product is in wishlist
  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some((item) => item.id === productId);
  }

  // Toggle wishlist status
  toggleWishlist(product: IProduct): void {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  // Clear wishlist
  clearWishlist(): void {
    this.wishlistItems.set([]);
  }
}
