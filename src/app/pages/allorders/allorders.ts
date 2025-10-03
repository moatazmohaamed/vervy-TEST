import { Component, signal } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-allorders',
  imports: [RouterLink],
  templateUrl: './allorders.html',
  styleUrl: './allorders.scss',
})
export class Allorders {
  orderNumber = signal('');
  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.orderNumber.set('ORD-' + Math.floor(100000 + Math.random() * 900000));
    // Clear the cart immediately when user clicks Place Order
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  ngOnDestroy(): void {
    this.cartService.clearCart().subscribe();
  }
}
