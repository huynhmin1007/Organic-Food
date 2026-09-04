import { useEffect, useMemo, useState } from "react";
import type {
  Product,
  ProductDetail,
  ProductFilterRequest,
} from "../lib/types/product";
import { fetchProduct, fetchProducts } from "../services/productService";

type UseProductListParams = Omit<ProductFilterRequest, "page"> & {
  page?: number;
  enabled?: boolean;
};

type UseProductListResult = {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
};

export function useProductList(
  filter: UseProductListParams,
): UseProductListResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {
    page = 0,
    size = 20,
    categoryIds,
    categorySlugs,
    includeDescendants,
    brandIds,
    brandSlugs,
    keyword,
    minPrice,
    maxPrice,
    onSale,
    sort,
    productIds,
    enabled = true,
  } = filter;

  // Mảng là reference mới mỗi render -> join thành chuỗi để làm dependency ổn định
  const productIdsKey = productIds?.join(",") ?? "";
  const categoryIdsKey = categoryIds?.join(",") ?? "";
  const categorySlugsKey = categorySlugs?.join(",") ?? "";
  const brandIdsKey = brandIds?.join(",") ?? "";
  const brandSlugsKey = brandSlugs?.join(",") ?? "";

  const requestFilter: ProductFilterRequest = useMemo(
    () => ({
      page,
      size,
      categoryIds,
      categorySlugs,
      includeDescendants,
      brandIds,
      brandSlugs,
      keyword,
      minPrice,
      maxPrice,
      onSale,
      sort,
      productIds,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      page,
      size,
      categoryIdsKey,
      categorySlugsKey,
      includeDescendants,
      brandIdsKey,
      brandSlugsKey,
      keyword,
      minPrice,
      maxPrice,
      onSale,
      sort,
      productIds,
    ],
  );

  useEffect(() => {
    if (!enabled) {
      setProducts([]);
      setTotalElements(0);
      setTotalPages(0);
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);

    fetchProducts(requestFilter)
      .then((res) => {
        if (ignore) return;
        setProducts(res.content);
        setTotalElements(res.totalElements);
        setTotalPages(res.totalPages);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err.message);
        setProducts([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [requestFilter, enabled]);

  return { products, loading, error, totalElements, totalPages };
}

type UseProductResult = {
  product: ProductDetail | null;
  loading: boolean;
  error: string | null;
};

export function useProduct({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}): UseProductResult {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProduct(id, slug)
      .then((res) => {
        setProduct(res);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    product,
    loading,
    error,
  };
}
