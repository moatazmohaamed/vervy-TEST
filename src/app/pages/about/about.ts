import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About {
  // Content sections from requirements
  sections = {
    intro: {
      title: 'About Vervy',
      content: "At Vervy, we believe beauty is more than skin deep—it's about confidence, individuality, and care. Born from a passion for clean beauty and creative expression, Vervy is a skincare and cosmetics brand dedicated to crafting products that don't just look good, but also feel good and do good."
    },
    journey: {
      title: 'Our Journey',
      content: "Our journey began with a simple idea: lip products that deliver both shine and nourishment. Using high-quality materials, natural oils, and safe, vegan colorants, we developed lip glosses and balms that combine hydration, comfort, and vibrant shades. But Vervy isn't stopping there—our vision expands into a full range of skincare and cosmetics designed to enhance your natural beauty while keeping your skin healthy."
    },
    philosophy: {
      title: 'Our Philosophy',
      points: [
        'Clean & Conscious – We use ingredients that are safe, effective, and kind to your skin and the planet.',
        'Vegan & Cruelty-Free – No animal testing, no animal by-products—ever.',
        'Self-Expression First – Beauty is personal, and every product is designed to let you create your own vibe, your own verve.'
      ]
    },
    promise: {
      title: 'Our Promise',
      intro: "With Vervy, you'll always get products that are:",
      points: [
        'High-performance yet gentle on skin',
        'Trendy & fun',
        'Nourishing, thanks to skincare-focused formulations'
      ],
      conclusion: "We're here to bring you the best of both worlds—makeup that feels like skincare, and skincare that feels like self-care. Because at the end of the day, beauty isn't about fitting in—it's about standing out and getting your own verve on."
    },
    mission: {
      title: 'Our Mission',
      content: 'To create skincare and cosmetics that blend beauty with care, using clean, vegan, and cruelty-free ingredients. We aim to empower people to express themselves confidently while nourishing their skin with products that are as safe as they are stylish.'
    },
    vision: {
      title: 'Our Vision',
      content: 'To become a global leader in clean beauty, known for delivering products that bring together innovation, sustainability, and self-expression. Vervy envisions a future where beauty is not just about looking good, but also about feeling good and doing good for the planet.'
    },
    values: {
      title: 'Our Core Values',
      points: [
        'Clean & Conscious – Safe, sustainable, and transparent ingredients.',
        'Self-Expression – Beauty that celebrates individuality, not conformity.',
        'Vegan & Cruelty-Free – Always ethical, never tested on animals.',
        'Innovation – Blending skincare science with cosmetics trends.',
        'Sustainability – Creating products that care for both people and the planet.'
      ]
    },
    ingredients: {
      title: 'Our Ingredients: Powered by TKB Materials',
      content: "At Vervy, we care about what goes into every product. That's why we proudly use TKB materials—high-quality cosmetic ingredients trusted by indie beauty brands and professional formulators worldwide.",
      description: 'TKB Trading is known for its safe, tested, and FDA-approved pigments, bases, and raw materials that allow us to create products that are not only vibrant and effective but also skin-friendly and clean.',
      reasons: {
        title: 'Why We Choose TKB',
        points: [
          'Safety First – TKB provides lip-safe pigments, micas, and dispersions that meet strict cosmetic safety standards.',
          'Innovation – With unique bases like Flexagel, we can craft lip glosses with the perfect shine and cushiony feel.',
          "Vegan Options – Many TKB materials are plant-based and cruelty-free, aligning with Vervy's values.",
          'Customization – A wide range of liquid pigments, shimmers, and oils help us design shades that are fun, bold, and uniquely Vervy.'
        ]
      },
      examples: {
        title: 'Examples of TKB Materials We Use',
        points: [
          'Flexagel – A flexible gel base that gives our glosses their smooth, glossy texture.',
          'Lip-Safe Pigments & Micas – For vibrant, customizable colors and shimmers.',
          'Natural Oils & Butters – Moisturizing bases that keep lips nourished.',
          'Vitamin E (Tocopherol) – An antioxidant that protects and conditions lips.'
        ],
        conclusion: 'By working with TKB ingredients, Vervy ensures every product is safe, effective, and made to shine—just like you.'
      }
    }
  };
}
