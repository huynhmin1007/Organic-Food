import axiosClient from "../lib/axiosClient";
import type { ApiResponse } from "../lib/types/api";
import type { Category } from "../lib/types/category";

export async function fetchCategories(): Promise<Category[]> {
  const { data } =
    await axiosClient.get<ApiResponse<Category[]>>("/categories");
  return data.data;
}

export async function fetchCategoryTree(
  id?: number,
  keyword?: string,
  slug?: string,
): Promise<Category> {
  const { data } = await axiosClient.get<ApiResponse<Category>>(
    "/categories/tree",
    {
      params: {
        id,
        keyword,
        slug,
      },
    },
  );

  return data.data;
}
