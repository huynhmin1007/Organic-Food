import { getProducts, type ProductFilter } from "../services/productService";
import { useFetch } from "./useFetch";

export function useProducts(filter: ProductFilter) {
  const filterKey = JSON.stringify(filter);

  const { data, isLoading, error } = useFetch(
    (signal) => getProducts(filter, signal),
    [filterKey],
  );

  return {
    products: data?.content ?? [],
    pagination: data
      ? {
          page: data.page,
          size: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          isFirst: data.first,
          isLast: data.last,
        }
      : null,
    isLoading,
    error,
  };
}
