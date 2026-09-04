import { useEffect, useState } from "react";
import type { Category } from "../lib/types/category";
import {
  fetchCategories,
  fetchCategoryTree,
} from "../services/categoryService";

type UseCategoryListResult = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

export function useCategoryList(): UseCategoryListResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err: Error) => {
        setError(err.message);
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    categories,
    loading,
    error,
  };
}

type UseCategoryParams = {
  id?: number;
  keyword?: string;
  slug?: string;
};

type UseCategoryResult = {
  category: Category | null;
  loading: boolean;
  error: string | null;
};

export function useCategory({
  id,
  keyword,
  slug,
}: UseCategoryParams): UseCategoryResult {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchCategoryTree(id, keyword, slug)
      .then((res) => {
        setCategory(res);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setCategory(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    category,
    loading,
    error,
  };
}
