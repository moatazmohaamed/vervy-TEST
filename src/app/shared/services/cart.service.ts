import { Injectable, computed, signal } from '@angular/core';
import { MockProduct, MOCK_PRODUCTS } from '../data/mock-products';

export interface CartItem {
  product: MockProduct;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  // Public signals and computed values
  readonly items = this.cartItems.asReadonly();
  
  readonly totalItems = computed(() => {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  });
  
  readonly subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });
  
  readonly tax = computed(() => {
    return this.subtotal() * 0.07; // 7% tax rate
  });
  
  readonly total = computed(() => {
    return this.subtotal() + this.tax();
  });

  constructor() {
    // Initialize with some dummy products for demonstration
    this.addToCart(MOCK_PRODUCTS[0], 1);
    this.addToCart(MOCK_PRODUCTS[2], 2);
  }

  addToCart(product: MockProduct, quantity: number): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...items, { product, quantity }];
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    this.cartItems.update(items => 
      items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  }

  removeFromCart(productId: string): void {
    this.cartItems.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}