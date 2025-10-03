import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'sticky top-0 z-50 block bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70',
    role: 'banner',
  },
})
export class Navbar {
  protected readonly isMenuOpen = signal(false);
  protected readonly selectedCategory = signal<string | null>(null);

  constructor(private router: Router) {
    // Initialize smooth scrolling behavior
    this.initSmoothScrolling();
  }

  protected toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  protected closeMenu() {
    this.isMenuOpen.set(false);
    // Close the drawer by unchecking the checkbox
    const checkbox = document.getElementById('my-drawer') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }

  protected filterByCategory(category: string) {
    this.selectedCategory.set(category);
    this.closeMenu();
    
    // Navigate to products page with category filter
    this.router.navigate(['/products'], { 
      queryParams: { category: category }
    });
  }

  private initSmoothScrolling() {
    // Add smooth scrolling behavior to the sidebar
    document.addEventListener('DOMContentLoaded', () => {
      const sidebarContent = document.querySelector('.smooth-scroll');
      if (sidebarContent) {
        // Apply smooth scrolling behavior
        sidebarContent.addEventListener('touchstart', (e) => {
          // Prevent default only if needed for specific elements
          if ((e.target as HTMLElement).tagName !== 'INPUT' && 
              (e.target as HTMLElement).tagName !== 'BUTTON' &&
              !(e.target as HTMLElement).closest('a')) {
            e.preventDefault();
          }
        }, { passive: false });
      }
    });
  }
}
