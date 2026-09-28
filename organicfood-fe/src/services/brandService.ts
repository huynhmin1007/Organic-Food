import { apiClient } from "../lib/axios";
import type { Brand } from "../types/brand";

export interface BrandFilter {
  categoryId?: number;
  categorySlug?: string;
  includeDescendants?: boolean;
  keyword?: string;
}

export async function getBrands(
  filter: BrandFilter,
  signal?: AbortSignal,
): Promise<Brand[]> {
  const { data } = await apiClient.get<Brand[]>("/brands", {
    params: filter,
    signal,
  });

  return data;
}
