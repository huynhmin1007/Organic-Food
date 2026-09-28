import { getProductBySlug } from "../services/productService";
import { useFetch } from "./useFetch";

export function useProductDetail(slug: string) {
  const { data, isLoading, error } = useFetch(
    (signal) => getProductBySlug(slug, signal),
    [slug],
  );

  return { product: data, isLoading, error };
}
