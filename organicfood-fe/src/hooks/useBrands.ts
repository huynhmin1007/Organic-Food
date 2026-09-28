import { getBrands, type BrandFilter } from "../services/brandService";
import { useFetch } from "./useFetch";

export function useBrands(filter: BrandFilter) {
  const filterKey = JSON.stringify(filter);

  const { data, isLoading, error } = useFetch(
    (signal) => getBrands(filter, signal),
    [filterKey],
  );

  return {
    brands: data ?? [],
    isLoading,
    error,
  };
}
