import type { Brand } from "./brand";
import type { Category } from "./category";

export type DiscountType =
  | "PERCENTAGE"
  | "FIXED_PRICE_FOR_QUANTITY"
  | "BUY_X_GET_Y_FREE"
  | "BUY_X_GET_Y_PERCENT_OFF";

export interface ProductDiscount {
  discountType: DiscountType;
  label: string;
  discountPercent: number;
  fixedPrice: number;
  buyQuantity: number;
  getQuantity: number;
  endAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: number;
  brandId: number;
  packQuantity: number;
  packUnit: string;
  packDetail: string;
  price: number;
  thumbnailUrl: string;
  stockQuantity: number;
  discounts: ProductDiscount[];
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  sku: string;
  packQuantity: number;
  packUnit: string;
  packDetail: string;
  price: number;
  stockQuantity: number;
  shortDescription: string;
  featureSpecification: string;
  productArticle: string;
  images: string[];
  category: Category;
  brand: Brand;
  discounts: ProductDiscount[];
}
