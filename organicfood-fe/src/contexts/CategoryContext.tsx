import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Category } from "../lib/types/category";
import { fetchCategories } from "../services/categoryService";
import { buildCategoryIdToSlugMap } from "../lib/category";

type CategoryContextValue = {
  categories: Category[];
  categoryIdToSlug: Map<number, string>;
  loading: boolean;
  error: string | null;
};

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryIdToSlug = useMemo(
    () => buildCategoryIdToSlugMap(categories),
    [categories],
  );

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    fetchCategories()
      .then((res) => {
        if (ignore) return;
        setCategories(res);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err.message);
        setCategories([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []); // chỉ fetch 1 lần khi Provider mount

  return (
    <CategoryContext.Provider
      value={{ categories, categoryIdToSlug, loading, error }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCategory(): CategoryContextValue {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategory phải được gọi bên trong <CategoryProvider>");
  }
  return ctx;
}
