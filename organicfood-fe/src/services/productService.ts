import axiosClient from "../lib/axiosClient";
import type { ApiResponse, PageResponse } from "../lib/types/api";
import {
  type Product,
  type ProductDetail,
  type ProductFilterRequest,
} from "../lib/types/product";

export async function fetchProducts(
  filter: ProductFilterRequest,
): Promise<PageResponse<Product>> {
  const { data } = await axiosClient.get<ApiResponse<PageResponse<Product>>>(
    "/products",
    { params: filter },
  );
  return data.data;
}

export async function fetchProduct(id?: string, slug?: string) {
  const endpoint = id ? `/products/${id}` : `/products/slug/${slug}`;

  const { data } = await axiosClient.get<ApiResponse<ProductDetail>>(endpoint);

  return data.data;
}
