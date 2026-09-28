import type { LoaderFunctionArgs } from "react-router-dom";
import type { Order } from "../types/order";
import { getOrders } from "../services/orderService";

export async function orderLoader({
  params,
  request,
}: LoaderFunctionArgs): Promise<Order | null> {
  const orders = await getOrders(request.signal);
  return orders.find((o) => o.code === params.code) ?? null;
}
