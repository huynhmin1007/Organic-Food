import type { Brand } from "./brand";
import type { Category } from "./category";

export type DiscountType =
  | "PERCENTAGE"
  | "FIXED_PRICE_FOR_QUANTITY"
  | "BUY_X_GET_Y_FREE"
  | "BUY_X_GET_Y_PERCENT_OFF";

export type ProductDiscount = {
  discountType: DiscountType;
  label: string;
  discountPercent: number;
  fixedPrice: number;
  buyQuantity: number;
  getQuantity: number;
};

export type Product = {
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
};

export type ProductDetail = {
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
};

export type ProductSortType =
  | "BEST_SELLING_WEEKLY"
  | "BEST_SELLING_MONTHLY"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "NAME_ASC"
  | "NAME_DESC";

export type ProductFilterRequest = {
  page: number;
  size: number;
  categoryIds?: number[];
  categorySlugs?: string[];
  includeDescendants?: boolean;
  brandIds?: number[];
  brandSlugs?: string[];
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  sort?: ProductSortType;
  productIds?: string[];
};
