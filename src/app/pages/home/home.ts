import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MOCK_PRODUCTS } from '../../shared/data/mock-products';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { CarouselComponent } from '../../shared/components/carousel/carousel';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, CarouselComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class Home {
  protected readonly products = signal(MOCK_PRODUCTS);
  protected readonly newProducts = computed(() =>
    this.products()
      .filter((p) => (p as any).isNew)
      .slice(0, 4)
  );
  protected readonly bestSellers = computed(() =>
    this.products()
      .filter((p) => (p as any).isBestSeller)
      .slice(0, 4)
  );

  protected readonly faqItems = signal<FaqItem[]>([
    {
      question: 'What is Vervy?',
      answer:
        'Vervy is a skincare and cosmetics brand that creates lip glosses, balms, and other beauty products using clean, vegan, and cruelty-free ingredients. Our mission is to combine style, hydration, and safe formulations so you can look and feel your best.',
    },
    {
      question: 'Are Vervy products vegan and cruelty-free?',
      answer:
        'Yes. All of our products are 100% vegan and cruelty-free. We never test on animals, and we avoid animal-derived ingredients.',
    },
    {
      question: 'What ingredients do you use?',
      answer:
        'We use high-quality materials from TKB Trading, including lip-safe pigments, Flexagel bases, natural oils, butters, and Vitamin E. Every ingredient is carefully selected to be safe, effective, and nourishing.',
    },
    {
      question: 'Are Vervy lip glosses sticky?',
      answer:
        'No. Our glosses are formulated with Flexagel technology that provides a smooth, cushiony texture with high shine—without the stickiness.',
    },
    {
      question: 'Do your lip balms contain petroleum or parabens?',
      answer:
        'No. Our lip balms are free from parabens, sulfates, mineral oils, and petroleum. We focus on natural butters and oils that keep lips soft and healthy.',
    },
    {
      question: 'Are your products safe for sensitive skin?',
      answer:
        'Yes. We use clean, skin-friendly ingredients and avoid harsh chemicals. However, if you have extremely sensitive skin or known allergies, we recommend checking the ingredient list and doing a patch test first.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Yes. Vervy offers worldwide shipping so you can get your own verve on wherever you are.',
    },
    {
      question: 'How can I choose the right shade for me?',
      answer:
        'We provide detailed shade descriptions and swatches on each product page. You can also follow our social media for inspiration and real-life looks from our community.',
    },
    {
      question: 'How do I store Vervy products?',
      answer:
        'Keep them in a cool, dry place away from direct sunlight to maintain freshness and performance.',
    },
    {
      question: 'What does your slogan "Get Your Own Verve On" mean?',
      answer:
        'Its about confidence and self-expression. We believe beauty is personal, and with Vervy, you can express your own vibe, your own energy—your own verve.',
    },
  ]);

  protected addToCart(product: any) {
    alert(`Added to cart: ${product.name}`);
  }

  protected toggleFaq(event: Event) {
    const button = event.currentTarget as HTMLElement;
    const faqContent = button.nextElementSibling as HTMLElement | null;
    
    if (!faqContent) return; // Guard against null element
    
    const wasActive = faqContent.style.maxHeight !== '0px' && faqContent.style.maxHeight !== '';

    // Close all FAQs
    document.querySelectorAll('.rounded-xl > button').forEach((el) => {
      const content = el.nextElementSibling as HTMLElement | null;
      if (content) {
        content.style.maxHeight = '0px';
        content.style.paddingTop = '0';
        content.style.paddingBottom = '0';
      }
      const icon = el.querySelector('svg');
      if (icon) icon.style.transform = 'rotate(0deg)';
    });

    // Toggle current FAQ if it wasn't already active
    if (!wasActive) {
      faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
      faqContent.style.paddingTop = '1rem';
      faqContent.style.paddingBottom = '1.5rem';
      const icon = button.querySelector('svg');
      if (icon) icon.style.transform = 'rotate(45deg)';
    }
  }
}
