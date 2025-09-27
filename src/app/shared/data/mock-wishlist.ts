import { MockProduct } from './mock-products';

export const MOCK_WISHLIST_ITEMS: MockProduct[] = [
  {
    id: 'g1',
    name: 'Glaze Glow Lip Gloss',
    description: 'High-shine, non-sticky gloss with skin-loving oils.',
    price: 14.99,
    category: 'Lip Gloss',
    image_url: '/assets/gloss.jpg',
    stock: 20,
    isBestSeller: true,
  },
  {
    id: 'b1',
    name: 'Silk Balm',
    description: 'Ultra-hydrating balm for day and night.',
    price: 9.99,
    category: 'Lip Balm',
    image_url: '/assets/hero section/Picture4.jpg',
    stock: 50,
    isBestSeller: true,
  },
  {
    id: 'g3',
    name: 'Crystal Shine Gloss',
    description: 'Glass-like shine with vitamin E.',
    price: 13.5,
    category: 'Lip Gloss',
    image_url: '/assets/hero section/Picture3.jpg',
    stock: 18,
  }
];