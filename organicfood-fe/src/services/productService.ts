import { apiClient } from "../lib/axios";
import type { PageResponse } from "../types/api";
import type { Product, ProductDetail } from "../types/product";

export interface ProductFilter {
  page?: number;
  size?: number;
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
}

export type ProductSortType =
  | "BEST_SELLING_WEEKLY"
  | "BEST_SELLING_MONTHLY"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "NAME_ASC"
  | "NAME_DESC";

export async function getProducts(
  filter: ProductFilter,
  signal?: AbortSignal,
): Promise<PageResponse<Product>> {
  const { data } = await apiClient.get<PageResponse<Product>>("/products", {
    params: filter,
    signal,
  });

  return data;
}

export async function getProductBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<ProductDetail> {
  const { data } = await apiClient.get<ProductDetail>(
    `/products/slug/${slug}`,
    { signal },
  );
  return data;
}
