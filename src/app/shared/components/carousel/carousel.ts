import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent {
  hero = {
    title: 'Get Your Own Verve On',
    subtitle:
      'Vervy is a skincare and cosmetics brand that blends clean beauty with self-expression. From glossy lips to nourishing care, powered by skin-loving ingredients—made to keep you glowing, confident.',
  };

  currentImageIndex = signal(0);

  heroImages = [
    { path: '/assets/hero section/Picture8.jpg', alt: 'Vervy cosmetics lifestyle' },
    { path: '/assets/hero section/Picture4.jpg', alt: 'Vervy beauty collection' },
    { path: '/assets/hero section/Picture5.jpg', alt: 'Vervy makeup products' },
  ];

  nextImage(): void {
    this.currentImageIndex.update((current) =>
      current === this.heroImages.length - 1 ? 0 : current + 1
    );
  }

  prevImage(): void {
    this.currentImageIndex.update((current) =>
      current === 0 ? this.heroImages.length - 1 : current - 1
    );
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex.set(index);
  }
}
