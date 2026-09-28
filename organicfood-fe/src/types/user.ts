import type { Product } from "./product";

export interface User {
  accountId: string;
  email: string;
  fullName: string;
  phone: string;
  addresses: Address[];
}

export interface Address {
  id: number;
  address: string;
  default: boolean;
}

export interface Cart {
  totalQuantity: number;
  totalAmount: number;
  discountAmount: number;
  items: CartItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
