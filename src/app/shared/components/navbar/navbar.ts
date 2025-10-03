import { ChangeDetectionStrategy, Component, signal, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SearchInputComponent } from '../search-input/search-input';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SearchInputComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'sticky top-0 z-50 block bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70',
    role: 'banner',
  },
})
export class Navbar implements OnDestroy {
  protected readonly isMenuOpen = signal(false);
  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly isSearchModalOpen = signal(false);

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

  protected openSearchModal() {
    this.isSearchModalOpen.set(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // Add escape key listener
    document.addEventListener('keydown', this.handleModalKeydown);
  }

  protected closeSearchModal() {
    this.isSearchModalOpen.set(false);
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');

    // Remove escape key listener
    document.removeEventListener('keydown', this.handleModalKeydown);
  }

  private handleModalKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closeSearchModal();
    }
  }

  ngOnDestroy() {
    // Clean up modal state and event listeners
    if (this.isSearchModalOpen()) {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', this.handleModalKeydown);
    }
  }

  protected onSearch(query: string) {
    if (query.trim()) {
      // Navigate to products page with search query
      this.router.navigate(['/products'], {
        queryParams: { search: query }
      });
      this.closeSearchModal();
    }
  }

  protected onMobileSearch(query: string) {
    if (query.trim()) {
      // Navigate to products page with search query
      this.router.navigate(['/products'], {
        queryParams: { search: query }
      }).then(() => {
        // Close the mobile drawer after navigation completes
        this.closeMenu();
      });
    }
  }

  protected onSearchClear() {
    // Optional: Handle search clear if needed
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
