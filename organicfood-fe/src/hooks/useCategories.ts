import { getCategories } from "../services/categoryService";
import { useFetch } from "./useFetch";

export function useCategories() {
  const { data, isLoading, error } = useFetch((signal) =>
    getCategories(signal),
  );
  return { categories: data ?? [], isLoading, error };
}
