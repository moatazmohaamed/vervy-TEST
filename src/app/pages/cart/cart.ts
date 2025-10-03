import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { CartService } from '../../shared/services/cart.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    // Initialize cart on component load
    this.cartService.initializeCart().subscribe();
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(productId, newQuantity).subscribe();
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe();
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe();
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}
