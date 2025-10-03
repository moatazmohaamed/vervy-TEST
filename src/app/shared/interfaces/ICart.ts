export interface ICart {
  id: string;
  user_id: string;
  total: number;
  shipping: number;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ICartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends ICartItem {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    productImg: string;
    stock: number;
  };
}