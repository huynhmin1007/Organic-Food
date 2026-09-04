import axiosClient from "../lib/axiosClient";
import type { ApiResponse } from "../lib/types/api";
import type { Brand } from "../lib/types/brand";

export async function fetchBrands(
  categoryId?: number,
  categorySlug?: string,
  includeDescendants?: boolean,
): Promise<Brand[]> {
  const { data } = await axiosClient.get<ApiResponse<Brand[]>>("/brands", {
    params: {
      categoryId,
      categorySlug,
      includeDescendants,
    },
  });

  return data.data;
}
