import { apiClient } from "../lib/axios";
import type { Order, PlaceOrderRequest } from "../types/order";

export async function placeOrder(request: PlaceOrderRequest): Promise<Order> {
  const { data } = await apiClient.post("/orders/place-order", request);

  return data;
}

export async function getOrders(signal?: AbortSignal): Promise<Order[]> {
  const { data } = await apiClient.get("/orders", { signal });
  return data;
}
