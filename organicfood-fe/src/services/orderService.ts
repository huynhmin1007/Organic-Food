import axiosClient from "../lib/axiosClient";
import type { ApiResponse } from "../lib/types/api";
import type { OrderResponse, PlaceOrderPayload } from "../lib/types/order";

export async function placeOrder(
  payload: PlaceOrderPayload,
): Promise<OrderResponse> {
  const { data } = await axiosClient.post<ApiResponse<OrderResponse>>(
    "/orders/place-order",
    payload,
  );
  return data.data;
}

export async function getOrders(): Promise<OrderResponse[]> {
  const { data } =
    await axiosClient.get<ApiResponse<OrderResponse[]>>("/orders");
  return data.data;
}
