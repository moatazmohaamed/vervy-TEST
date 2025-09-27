import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
}
