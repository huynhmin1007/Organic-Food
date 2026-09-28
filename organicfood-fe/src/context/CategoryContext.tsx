import { createContext, useContext, type ReactNode } from "react";
import type { Category } from "../types/category";
import { useCategories } from "../hooks/useCategories";

interface CategoryContextValue {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const { categories, isLoading, error } = useCategories();

  return (
    <CategoryContext.Provider value={{ categories, isLoading, error }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider",
    );
  }
  return ctx;
}
