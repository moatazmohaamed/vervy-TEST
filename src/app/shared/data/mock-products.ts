import { IProduct } from '../interfaces/IProducts';

export interface MockProduct extends Omit<IProduct, 'isNew'> {
  isNew?: boolean;
  isBestSeller: boolean;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'ss',
    name: 'Glaze Glow Lip Gloss',
    description:
      'High-shine, non-sticky gloss with skin-loving oils. High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.High-shine, non-sticky gloss with skin-loving oils.',
    price: 14.99,
    category: 'Lip Gloss',
    productImg: '/assets/gloss.jpg',
    stock: 20,
    isBestSeller: true,
    created_at: '222',
    updated_at: '222',
    type: 'mega',
    isNew: false,
    images: [],
  },
];
