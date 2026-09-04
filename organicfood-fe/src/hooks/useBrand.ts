import { useEffect, useMemo, useState } from "react";
import type { Brand } from "../lib/types/brand";
import { fetchBrands } from "../services/brandService";

type UseBrandListParams = {
  categoryId?: number;
  categorySlug?: string;
  includeDescendants?: boolean;
};

type UseBrandListResult = {
  brands: Brand[];
  loading: boolean;
  error: string | null;
};

export function useBrandList(
  filter: UseBrandListParams = {},
): UseBrandListResult {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { categoryId, categorySlug, includeDescendants } = filter;

  const requestFilter: UseBrandListParams = useMemo(
    () => ({ categoryId, categorySlug, includeDescendants }),
    [categoryId, categorySlug, includeDescendants],
  );

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);

    fetchBrands(
      requestFilter.categoryId,
      requestFilter.categorySlug,
      requestFilter.includeDescendants,
    )
      .then((res) => {
        if (ignore) return;
        setBrands(res);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err.message);
        setBrands([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [requestFilter]);

  return { brands, loading, error };
}
