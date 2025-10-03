export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  productImg: string;
  stock: number;
  created_at: string;
  updated_at: string;
  type: string;
  images: string[];
  isNew: boolean;
  isBestSeller: boolean;
}
