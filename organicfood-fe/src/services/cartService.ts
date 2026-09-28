import { apiClient } from "../lib/axios";
import type { Cart } from "../types/user";

export async function updateCart(items: Record<string, number>): Promise<void> {
  await apiClient.post("/cart", { items });
}

export async function getCart(signal?: AbortSignal): Promise<Cart> {
  const { data } = await apiClient.get("/cart", { signal });
  return data;
}
