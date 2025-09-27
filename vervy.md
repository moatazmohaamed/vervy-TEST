# Vervy eCommerce Platform

## 1. Overview

The **Vervy eCommerce Platform** is a modern, professional, and fully functional online store designed to provide customers with a seamless shopping experience. Built using Angular and Supabase, the platform ensures secure authentication, efficient product management, and smooth checkout processes. It is optimized for performance, mobile responsiveness, scalability, and SEO.

---

## 2. Key Features

- **Navbar**

  **Mobile:**

  - Logo centered.
  - Profile and cart icons on the right (link to their respective pages).
  - Hamburger menu containing search and category navigation.

  **Large screens:**

  - Logo aligned left.
  - Profile, cart, and search icons aligned right.
  - Search always visible for easy access.

- **User Authentication**

  - User registration and login with email/password.
  - Unregistered users can browse but cannot checkout.
  - Secure session management with Supabase Auth.
  - Role-based access (Customer only).

- **Product Catalog**

  - Browse products by category and tags.
  - Search and filter functionality.
  - Product details including images, description, price, and availability.

- **Shopping Cart**

  - Add, update, and remove items.
  - Persistent cart across sessions.
  - Dynamic total calculation.

- **Checkout Process**

  - Step-by-step checkout with shipping details.
  - **Cash on Delivery (COD) only** as the payment method.
  - Order summary and confirmation.

- **Order Management**

  - Order history for users.
  - Admin dashboard for tracking orders.

- **SEO Optimization**

  - SEO-friendly URLs for products and categories.
  - Meta tags (title, description, keywords) per page.
  - Structured data (schema.org) for products and reviews.
  - Optimized images with alt tags.
  - Sitemap.xml and robots.txt for indexing.
  - Mobile-first responsive design.

- **Performance Optimization**
  - Angular lazy loading for routes and modules.
  - Tree-shaking and code splitting for minimal bundle size.
  - Image optimization (WebP, responsive image sizes).
  - Service worker caching strategies (PWA ready).
  - CDN for static assets.
  - Minified CSS/JS and critical CSS rendering.
  - Lighthouse score target: 90+ across Performance, SEO, Accessibility, Best Practices.
  - **Page load target: <1 second** on broadband connections.

---

## 3. Page Descriptions

### Home Page

- Hero Banner with background image (will be provided in assets) with Shop now button.
- New Realese Section and best seller.
- Category-based product listings.
- Quick links to trending or new arrivals.
- View all products button
- Pre-rendered for instant load.

### All Products Page

- Complete catalog of available products.
- Pagination for browsing large inventories.
- Filtering & Sorting Options: Filters: By type (Gloss / Balm). By price range. By color/flavor..
- Search bar for keyword-based discovery.
- Consistent SEO-friendly URLs (e.g., /products?page=2&category=shoes).
- Optimized for performance with incremental loading (lazy loading + infinite scroll option).

### Product Details Page

- Product name, description, images, price, and availability.
- Add-to-cart button and quantity selector.
- Related products suggestions.
- Structured product data for SEO.
- Optimized with server-side rendering (SSR).

### Shopping Cart Page

- List of items added by the user.
- Options to update quantity or remove items.
- Display of subtotal, taxes, and total cost.
- Checkout button.
- Cached for fast re-access.

### Checkout Page

- Order summary for confirmation.
- Customer information form (shipping address, contact details like name email phone number ).
- Payment method fixed to **Cash on Delivery**.
- Optimized form validation and instant feedback.

### Order Confirmation Page

- Thank-you message with order number.
- Order details including products, total, and COD status.
- Link to track order or return to home page.
- Lightweight static rendering for near-instant load.

---

## 4. Tools and Integrations

- **Frontend**: Angular 20 + Tailwind CSS for modern UI/UX.
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage, DB).
- **Payments**: Cash on Delivery (COD only).
- **Shipping**: Local courier service or manual fulfillment.
- **Hosting**: Supabase hosting.
- **Libraries**: RxJS, Angular signals, UI libraries .

---

## 5. Contact Information

For support, feedback, or inquiries:

- **Email**: support@vervy.com
- **Phone**: +20 100 000 0000

---

### Future Implementation

**Email Notifications**

- **Customer Confirmation Email**: Sent automatically after checkout with order details and COD reminder.
- **Admin Notification Email**: Sent automatically to the brand’s admin email with full customer + order info.
- Powered by Supabase Edge Functions and external email APIs (Resend, Brevo, Postmark).
