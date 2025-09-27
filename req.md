You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Goal

Build a **modern, feminine, and responsive UI** for a Lip Gloss & Lip Balm eCommerce website.  
This version should use **only static mock data** (no Supabase or backend integration yet).  
The UI must follow the structure and features required for both **users** and **future admin expansion**.

---

## Pages & Routes (with Lazy Loading)

1. `/home` → Home Page (hero section, featured products, CTA banner)
2. `/products` → All Products Page (grid display, filtering, pagination with mock data)
3. `/products/:id` → Single Product Page (details, image gallery, description, price, add-to-cart button – cart is dummy now)
4. `/about` → About Page (brand story, mission, feminine design)
5. `/contact` → Contact Page (form, brand contact info, store address placeholder)
6. `/cart` → Cart Page (static cart items, summary, checkout button – dummy only)

---

## Features to Implement (Static)

- **Product Cards**
  - Title, price, image, description (mocked from JSON file or hardcoded array)
  - Hover effect (e.g., zoom image or show “View Details” button)
- **Product Filters (on `/products`)**
  - By category (Lip Gloss, Lip Balm, Best Sellers, New Arrivals)
- **Product Detail Page**
  - Larger image
  - Description
  - Price
  - “Add to Cart” (just console.log or dummy alert)
- **Cart Page**
  - Static cart with items from mock data
  - Quantity controls (increase/decrease but no real logic yet)
  - Checkout button → dummy alert

---

## UI/UX Guidelines

3. UI design recommendations — "girly" / feminine aesthetic
   Color palette (pastel-driven)
   Blush Pink: #FFDDE6 (primary)
   Soft Rose: #FFB6C1 (accent)
   Cream: #FFF6F8 (background)
   Lavender: #E8DAFF (secondary)
   Neutral Gray: #7A6E6E (text)
   Typography
   Headings: elegant serif like Playfair Display or Merriweather for a luxe feel.
   Body: clean sans like Poppins or Inter for readability.
   Use larger line-height and generous letter spacing for product titles.
   Imagery & photography
   Use soft, natural lighting and consistent aspect ratio.
   Include lifestyle hero shots and product-only stills on plain backgrounds.

Add a subtle rounded mask and soft-shadow to gallery images for a premium look.
Layout and components
Card: rounded corners rounded-2xl , soft shadow shadow-md , image on top, centered CTA.
Buttons: pill-shaped, ample padding, subtle gradient or solid pastel. Add pressed state and microanimations.
Badge: small rounded labels for "New" or "Best Seller" with accent color.
Swatches: circle swatches with drop-shadow and selection border.
Sticky Add-to-Cart: mobile sticky CTA at bottom of screen for product pages.
Microinteractions
Hover scale transform: scale(1.03) on product card.
Add-to-cart animation: flying thumbnail to cart icon or small confetti burst.
Toast confirmation after add-to-cart and after successful checkout.
Accessibility
Maintain minimum contrast for text and interactive elements.
All images must have alt text.
Inputs should have labels and clear error states.

### Content

### About us - content

At Vervy, we believe beauty is more than skin deep—it’s about confidence, individuality, and care. Born from a passion for clean beauty and creative expression, Vervy is a skincare and cosmetics brand dedicated to crafting products that don’t just look good, but also feel good and do good.

Our journey began with a simple idea: lip products that deliver both shine and nourishment. Using high-quality materials, natural oils, and safe, vegan colorants, we developed lip glosses and balms that combine hydration, comfort, and vibrant shades. But Vervy isn’t stopping there—our vision expands into a full range of skincare and cosmetics designed to enhance your natural beauty while keeping your skin healthy.

Our Philosophy

Clean & Conscious – We use ingredients that are safe, effective, and kind to your skin and the planet.
Vegan & Cruelty-Free – No animal testing, no animal by-products—ever.
Self-Expression First – Beauty is personal, and every product is designed to let you create your own vibe, your own verve.

Our Promise

With Vervy, you’ll always get products that are:
• High-performance yet gentle on skin
• Trendy & fun.
• Nourishing, thanks to skincare-focused formulations

We’re here to bring you the best of both worlds—makeup that feels like skincare, and skincare that feels like self-care.

Because at the end of the day, beauty isn’t about fitting in—it’s about standing out and getting your own verve on.

Our Mission

To create skincare and cosmetics that blend beauty with care, using clean, vegan, and cruelty-free ingredients. We aim to empower people to express themselves confidently while nourishing their skin with products that are as safe as they are stylish.

Our Vision

To become a global leader in clean beauty, known for delivering products that bring together innovation, sustainability, and self-expression. Vervy envisions a future where beauty is not just about looking good, but also about feeling good and doing good for the planet.

Our Core Values

Clean & Conscious – Safe, sustainable, and transparent ingredients.
Self-Expression – Beauty that celebrates individuality, not conformity.
Vegan & Cruelty-Free – Always ethical, never tested on animals.
Innovation – Blending skincare science with cosmetics trends.
Sustainability – Creating products that care for both people and the planet.

Our Ingredients: Powered by TKB Materials

At Vervy, we care about what goes into every product. That’s why we proudly use TKB materials—high-quality cosmetic ingredients trusted by indie beauty brands and professional formulators worldwide.

TKB Trading is known for its safe, tested, and FDA-approved pigments, bases, and raw materials that allow us to create products that are not only vibrant and effective but also skin-friendly and clean.

Why We Choose TKB
• Safety First – TKB provides lip-safe pigments, micas, and dispersions that meet strict cosmetic safety standards.
• Innovation – With unique bases like Flexagel, we can craft lip glosses with the perfect shine and cushiony feel.
• Vegan Options – Many TKB materials are plant-based and cruelty-free, aligning with Vervy’s values.
• Customization – A wide range of liquid pigments, shimmers, and oils help us design shades that are fun, bold, and uniquely Vervy.

Examples of TKB Materials We Use
• Flexagel – A flexible gel base that gives our glosses their smooth, glossy texture.
• Lip-Safe Pigments & Micas – For vibrant, customizable colors and shimmers.
• Natural Oils & Butters – Moisturizing bases that keep lips nourished.
• Vitamin E (Tocopherol) – An antioxidant that protects and conditions lips.

By working with TKB ingredients, Vervy ensures every product is safe, effective, and made to shine—just like you.

### Contact page

Your name : - your phone no: - your email: Also you can send us on our what's app : 01002338226
