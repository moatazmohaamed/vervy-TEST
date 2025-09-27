import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IProduct } from '../../../shared/interfaces/IProducts';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card h-full flex flex-col overflow-hidden',
  },
  template: `
    <div class="relative">
      <img
        [ngSrc]="product().image_url"
        width="300"
        height="300"
        [alt]="product().name + ' product image'"
        class="h-56 w-full object-cover"
        loading="lazy"
        fetchpriority="low"
      />
      <div class="absolute left-3 top-3 flex gap-2">
        <span *ngIf="product().isNew" class="badge badge-accent">New</span>
        <span *ngIf="product().isBestSeller" class="badge badge-secondary">Best Seller</span>
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-4">
      <h3 class="font-display text-lg leading-tight">{{ product().name }}</h3>
      <p class="text-sm text-text/80 line-clamp-2">{{ product().description }}</p>
      <div class="mt-auto flex items-center justify-between">
        <span class="font-semibold">{{ product().price | currency:'USD':'symbol':'1.2-2' }}</span>
        <div class="flex gap-2">
          <a class="btn-primary text-xs px-4 py-2" [routerLink]="['/products', product().id]">View</a>
          <button class="btn-primary text-xs px-4 py-2" (click)="addToCart.emit(product())">Add</button>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  product = input.required<IProduct & { isNew?: boolean; isBestSeller?: boolean }>();
  addToCart = output<IProduct>();
}


