import { Injectable, computed, inject, signal } from '@angular/core';
import { IProduct } from '../interfaces/IProducts';
import { CartItemWithProduct, ICart, ICartItem } from '../interfaces/ICart';
import { SupabaseService } from '../../core/services/supabase/supabase-service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  from,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private supabaseService = inject(SupabaseService);

  // State management
  private cartItems = signal<CartItem[]>([]);
  cartId = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // User ID from auth service
  private userId = signal<string>('');

  constructor() {
    this.supabaseService.client.auth
      .getUser()
      .then(({ data }) => {
        if (data.user) {
          this.userId.set(data.user.id);
        }
      })
      .catch((error) => {
        console.error('Error getting user ID:', error);
      });
    this.initializeCart();
  }

  // Public signals and computed values
  readonly items = this.cartItems.asReadonly();
  readonly loading = this.isLoading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  readonly totalItems = computed(() => {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  });

  readonly total = computed(() => {
    return this.subtotal();
  });

  /**
   * Initialize the cart by fetching existing cart or creating a new one
   */
  initializeCart(): Observable<void> {
    this.isLoading.set(true);

    // First check if user has an active cart
    return this.getActiveCart().pipe(
      switchMap((cart) => {
        if (cart) {
          this.cartId.set(cart.id);
          return this.fetchCartItems(cart.id);
        } else {
          return this.createNewCart();
        }
      }),
      tap(() => {
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error initializing cart:', err);
        this.error.set('Failed to initialize cart');
        this.isLoading.set(false);
        return of(undefined);
      })
    );
  }

  /**
   * Get the active cart for the current user
   */
  private getActiveCart(): Observable<ICart | null> {
    return from(
      this.supabaseService.client
        .from('carts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data.length > 0 ? (data[0] as ICart) : null;
      }),
      catchError((err) => {
        console.error('Error getting active cart:', err);
        this.error.set('Failed to retrieve cart');
        return of(null);
      })
    );
  }

  /**
   * Create a new cart in Supabase
   */
  private createNewCart(): Observable<void> {
    return from(this.supabaseService.client.from('carts').insert({}).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (data) {
          // Set the cart ID from the returned data
          // this.cartId.set(data.id);
        }
        return undefined;
      }),
      catchError((err) => {
        console.error('Error creating cart:', err);
        this.error.set('Failed to create cart');
        return of(undefined);
      })
    );
  }

  /**
   * Fetch cart items for a given cart ID
   */
  private fetchCartItems(cartId: string): Observable<void> {
    this.isLoading.set(true);

    return from(
      this.supabaseService.client
        .from('cart_items')
        .select(
          `
          *,
          product:product_id (
            id, name, description, price, category, productImg, stock
          )
        `
        )
        .eq('cart_id', cartId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as CartItemWithProduct[];
      }),
      tap((cartItemsWithProducts) => {
        // Transform to CartItem[] format
        const items: CartItem[] = cartItemsWithProducts.map((item) => ({
          product: item.product as IProduct,
          quantity: item.quantity,
        }));

        this.cartItems.set(items);
        this.isLoading.set(false);
      }),
      map(() => undefined),
      catchError((err) => {
        console.error('Error fetching cart items:', err);
        this.error.set('Failed to load cart items');
        this.isLoading.set(false);
        return of(undefined);
      })
    );
  }

  /**
   * Add a product to the cart
   */
  addToCart(product: IProduct, quantity: number): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);

    // If no cart exists, create one first
    if (!this.cartId()) {
      return from(this.createNewCartAndAddItem(product, quantity));
    }

    // Check if item already exists in cart
    return this.getCartItem(product.id).pipe(
      switchMap((existingItem) => {
        if (existingItem) {
          // Update existing item quantity
          return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
          // Add new item to cart
          return this.addCartItem(product, quantity);
        }
      }),
      tap(() => {
        // Update local state optimistically
        this.cartItems.update((items) => {
          const existingItem = items.find((item) => item.product.id === product.id);

          if (existingItem) {
            return items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            return [...items, { product, quantity }];
          }
        });

        this.updateCartTotal();
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error adding to cart:', err);
        this.error.set('Failed to add item to cart');
        this.isLoading.set(false);
        return of(undefined);
      })
    );
  }

  /**
   * Create a new cart and add an item to it
   */
  private createNewCartAndAddItem(product: IProduct, quantity: number): Observable<void> {
    return from(
      this.supabaseService.client
        .from('carts')
        .insert({
          user_id: this.userId(),
          total: product.price * quantity,
        })
        .select()
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) throw error;

        if (!data || data.length === 0) {
          throw new Error('Failed to create cart');
        }

        const cartId = data[0].id;
        this.cartId.set(cartId);

        return from(
          this.supabaseService.client.from('cart_items').insert({
            cart_id: cartId,
            product_id: product.id,
            quantity: quantity,
            price: product.price,
          })
        );
      }),
      tap(({ error }) => {
        if (error) throw error;

        // Update local state
        this.cartItems.update((items) => [...items, { product, quantity }]);
        this.isLoading.set(false);
      }),
      map(() => undefined),
      catchError((err) => {
        console.error('Error creating cart and adding item:', err);
        this.error.set('Failed to create cart and add item');
        this.isLoading.set(false);
        return of(undefined);
      })
    );
  }

  /**
   * Get a cart item by product ID
   */
  private getCartItem(productId: string): Observable<ICartItem | null> {
    return from(
      this.supabaseService.client
        .from('cart_items')
        .select('*')
        .eq('cart_id', this.cartId())
        .eq('product_id', productId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data.length > 0 ? (data[0] as ICartItem) : null;
      }),
      catchError((err) => {
        console.error('Error getting cart item:', err);
        return of(null);
      })
    );
  }

  /**
   * Add a new item to the cart
   */
  private addCartItem(product: IProduct, quantity: number): Observable<void> {
    return from(
      this.supabaseService.client.from('cart_items').insert({
        cart_id: this.cartId(),
        product_id: product.id,
        quantity: quantity,
      })
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return undefined;
      }),
      catchError((err) => {
        console.error('Error adding cart item:', err);
        this.error.set('Failed to add item to cart');
        return of(undefined);
      })
    );
  }

  /**
   * Update the quantity of a cart item
   */
  updateQuantity(productId: string, quantity: number): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    return this.getCartItem(productId).pipe(
      switchMap((cartItem) => {
        if (!cartItem) {
          throw new Error('Cart item not found');
        }

        return this.updateCartItemQuantity(cartItem.id, quantity);
      }),
      tap(() => {
        // Update local state optimistically
        this.cartItems.update((items) =>
          items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
        );

        this.updateCartTotal();
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error updating quantity:', err);
        this.error.set('Failed to update item quantity');
        this.isLoading.set(false);
        return of(undefined);
      })
    );
  }

  /**
   * Update the quantity of a cart item in Supabase
   */
  private updateCartItemQuantity(cartItemId: string, quantity: number): Observable<void> {
    return from(
      this.supabaseService.client
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return undefined;
      }),
      catchError((err) => {
        console.error('Error updating cart item quantity:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Remove an item from the cart
   */
  removeFromCart(productId: string): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.getCartItem(productId).pipe(
      switchMap((cartItem) => {
        if (!cartItem) {
          throw new Error('Cart item not found');
        }

        return from(
          this.supabaseService.client.from('cart_items').delete().eq('id', cartItem.id)
        ).pipe(
          map(({ error }) => {
            if (error) throw error;
            return undefined;
          })
        );
      }),
      tap(() => {
        // Update local state optimistically
        this.cartItems.update((items) => items.filter((item) => item.product.id !== productId));

        this.updateCartTotal();
        this.isLoading.set(false);
      }),
      catchError((err) => {
        console.error('Error removing from cart:', err);
        this.error.set('Failed to remove item from cart');
        this.isLoading.set(false);
        return of(undefined);
      })
    );
  }

  /**
   * Clear the entire cart
   */
  clearCart(): Observable<void> {
    this.isLoading.set(true);
    this.error.set(null);

    if (!this.cartId()) {
      this.isLoading.set(false);
      return of(undefined);
    }

    // Manually delete all cart items
    return from(
      this.supabaseService.client.from('cart_items').delete().eq('cart_id', this.cartId())
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return undefined;
      }),
      tap(() => {
        this.cartItems.set([]);
      }),
      catchError((err) => {
        console.error('Error clearing cart:', err);
        this.error.set('Failed to clear cart');
        return throwError(() => err);
      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    );
  }

  private updateCartTotal(): void {
    if (!this.cartId()) return;

    const total = this.total();

    from(
      this.supabaseService.client
        .from('carts')
        .update({
          total,
          updated_at: new Date().toISOString(),
        })
        .eq('id', this.cartId())
    )
      .pipe(
        map(({ error }) => {
          if (error) throw error;
          return undefined;
        }),
        catchError((err) => {
          console.error('Error updating cart total:', err);
          return of(undefined);
        })
      )
      .subscribe();
  }
}
