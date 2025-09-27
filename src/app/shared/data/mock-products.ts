import { IProduct } from '../interfaces/IProducts';

export interface MockProduct extends IProduct {
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'g1',
    name: 'Glaze Glow Lip Gloss',
    description:
      'High-shine, non-sticky gloss with skin-loving oils. High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.',
    price: 14.99,
    category: 'Lip Gloss',
    image_url: '/assets/gloss.jpg',
    stock: 20,
    isBestSeller: true,
  },
  {
    id: 'g2',
    name: 'Petal Kiss Gloss',
    description:
      'Soft rose tint with nourishing jojoba. High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.',
    price: 12.0,
    category: 'Lip Gloss',
    image_url: '/assets/palmsss.jpg',
    stock: 35,
    isNew: true,
  },
  {
    id: 'b1',
    name: 'Silk Balm',
    description:
      'Ultra-hydrating balm for day and night. High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.',
    price: 9.99,
    category: 'Lip Balm',
    image_url: '/assets/hero section/Picture4.jpg',
    stock: 50,
    isBestSeller: true,
  },
  {
    id: 'b2',
    name: 'Lavender Soothe Balm',
    description:
      'Calming lavender scent, buttery smooth feel. High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.',
    price: 10.5,
    category: 'Lip Balm',
    image_url: '/assets/hero section/Picture2.jpg',
    stock: 28,
    isNew: true,
  },
  {
    id: 'g3',
    name: 'Crystal Shine Gloss',
    description:
      'Glass-like shine with vitamin E. High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.',
    price: 13.5,
    category: 'Lip Gloss',
    image_url: '/assets/hero section/Picture3.jpg',
    stock: 18,
  },
];
