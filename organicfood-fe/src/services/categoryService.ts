import { apiClient } from "../lib/axios";
import type { Category } from "../types/category";

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/categories", { signal });
  return data;
}
