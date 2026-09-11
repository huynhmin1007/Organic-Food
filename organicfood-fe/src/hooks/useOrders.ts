import { useEffect, useState } from "react";
import type { OrderResponse } from "../lib/types/order";
import { getOrders } from "../services/orderService";

type UseOrdersResult = {
  orders: OrderResponse[];
  loading: boolean;
  error: string | null;
};

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    getOrders()
      .then((res) => {
        if (ignore) return;
        setOrders(res);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err.message);
        setOrders([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { orders, loading, error };
}
