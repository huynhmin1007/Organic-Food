import { getOrders } from "../services/orderService";
import { useFetch } from "./useFetch";

export function useOrders(enabled = true) {
  return useFetch((signal) => getOrders(signal), [], enabled);
}
