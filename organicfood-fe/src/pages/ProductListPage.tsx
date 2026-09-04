import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ScrollableCategoryRow from "../components/layout/ScrollableCategoryRow";
import Container from "../components/ui/Container";
import { useCategory } from "../contexts/CategoryContext";
import { useBrandList } from "../hooks/useBrand";
import { filterCategoriesByKeyword, findCategoryPath } from "../lib/category";
import { parseListParam, toggleListValue } from "../lib/queryParams";
import type { Category } from "../lib/types/category";
import type { ProductSortType } from "../lib/types/product";
import ScrollableBrandRow from "../components/layout/ScrollableBrandRow";
import { useProductList } from "../hooks/useProduct";
import Pagination from "../components/ui/Pagination";
import ProductCard from "../features/product/ProductCard";
import ScrollableProductRow from "../components/layout/ScrollableProductRow";

const PAGE_SIZE = 20;

const SORT_OPTIONS: { value: ProductSortType; label: string }[] = [
  { value: "PRICE_ASC", label: "Giá thấp đến cao" },
  { value: "PRICE_DESC", label: "Giá cao đến thấp" },
  { value: "NAME_ASC", label: "Tên A-Z" },
  { value: "NAME_DESC", label: "Tên Z-A" },
];

const ON_SALE_VALUE = "ON_SALE";

export function ProductListPage() {
  const navigate = useNavigate();

  const { category: categorySlugParam } = useParams<{ category: string }>();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isSearchMode = pathname === "/tim-kiem";
  const keyword = searchParams.get("keyword") ?? "";
  const page = Number(searchParams.get("page") ?? 0);

  const selectedSubCategorySlugs = parseListParam(searchParams, "categories");
  const selectedBrandSlugs = parseListParam(searchParams, "brands");

  const { categories } = useCategory();

  const { brands } = useBrandList({
    categorySlug: !isSearchMode ? categorySlugParam : undefined,
    includeDescendants: !isSearchMode,
  });

  // ----- Xác định vị trí trong cây category (chỉ để dựng UI, tối đa 3 cấp) -----
  const categoryPath = useMemo<Category[] | null>(() => {
    if (isSearchMode || !categorySlugParam) return null;
    return findCategoryPath(categories, categorySlugParam);
  }, [isSearchMode, categorySlugParam, categories]);

  const level1 = categoryPath?.[0] ?? null;
  const level2Selected = categoryPath?.[1] ?? null;
  const level2Items = level1?.children ?? [];
  const level3Items = level2Selected?.children ?? [];

  const selectedSubCategoryIds = useMemo(
    () =>
      new Set(
        level3Items
          .filter((c) => selectedSubCategorySlugs.includes(c.slug))
          .map((c) => c.id),
      ),
    [level3Items, selectedSubCategorySlugs],
  );

  const matchedCategories = useMemo(() => {
    if (!isSearchMode || !keyword) return [];
    return filterCategoriesByKeyword(categories, keyword);
  }, [isSearchMode, keyword, categories]);

  const sort = (searchParams.get("sort") as ProductSortType) ?? undefined;
  const onSale = searchParams.get("onSale") === "true" ? true : undefined;

  // Giá trị hiển thị trên <select>: rỗng (mặc định) | ON_SALE_VALUE | 1 trong các ProductSortType
  const sortSelectValue = onSale ? ON_SALE_VALUE : (sort ?? "");

  const { products, loading, error, totalPages } = useProductList({
    page,
    size: PAGE_SIZE,
    sort,
    onSale: true,
    keyword: isSearchMode ? keyword : undefined,
    categorySlugs: !isSearchMode
      ? selectedSubCategorySlugs.length > 0
        ? selectedSubCategorySlugs
        : categorySlugParam
          ? [categorySlugParam]
          : undefined
      : undefined,
    includeDescendants: !isSearchMode && selectedSubCategorySlugs.length === 0,
    brandSlugs: selectedBrandSlugs.length > 0 ? selectedBrandSlugs : undefined,
  });

  const productSalesCategory = level2Selected ?? level1;

  const {
    products: productSales,
    loading: productSalesLoading,
    totalPages: productSalesTotalPages,
  } = useProductList({
    page: 0,
    size: 50,
    onSale: true,
    keyword: isSearchMode ? keyword : undefined,
    categorySlugs:
      !isSearchMode && productSalesCategory
        ? [productSalesCategory.slug]
        : undefined,
    includeDescendants: !isSearchMode,
    brandSlugs: selectedBrandSlugs.length > 0 ? selectedBrandSlugs : undefined,
  });

  const toggleListParam = (key: string, current: string[], value: string) => {
    const next = toggleListValue(current, value);
    const nextParams = new URLSearchParams(searchParams);
    if (next.length > 0) nextParams.set(key, next.join(","));
    else nextParams.delete(key);
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === "") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");

    if (value === "") {
      // Mặc định: không sort, không lọc giảm giá
      next.delete("sort");
      next.delete("onSale");
    } else if (value === ON_SALE_VALUE) {
      next.set("onSale", "true");
      next.delete("sort");
    } else {
      next.set("sort", value);
      next.delete("onSale");
    }

    setSearchParams(next);
  };

  const title = isSearchMode
    ? keyword
    : (level2Selected?.name ?? level1?.name ?? "");

  return (
    <Container className="space-y-5">
      <div className="bg-white rounded-md flex items-center px-3 py-2 gap-3">
        <button onClick={() => navigate(-1)} aria-label="Quay lại">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-base">{title}</h1>
      </div>
      {isSearchMode && matchedCategories.length > 0 && (
        <div className="bg-white shadow-sm rounded-md px-3 py-3">
          <p className="text-base mb-2">Lọc theo ngành hàng:</p>
          <ScrollableCategoryRow
            categories={matchedCategories}
            mode="navigate"
            selectedId={null}
          />
        </div>
      )}

      {!isSearchMode && level2Items.length > 0 && (
        <div className="bg-white shadow-sm rounded-md px-3 py-2">
          <ScrollableCategoryRow
            categories={level2Items}
            mode="navigate"
            selectedId={level2Selected?.id ?? null}
            size="md"
          />
        </div>
      )}

      {!isSearchMode && level3Items.length > 0 && (
        <div className="bg-white shadow-sm rounded-md px-3 py-2">
          <ScrollableCategoryRow
            categories={level3Items}
            mode="multiSelect"
            selectedIds={selectedSubCategoryIds}
            onToggle={(cat) =>
              toggleListParam("categories", selectedSubCategorySlugs, cat.slug)
            }
            size="sm"
          />
        </div>
      )}

      <div className="flex items-center gap-3 bg-white shadow-sm rounded-md px-3 py-2">
        <select
          value={sortSelectValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm shrink-0"
        >
          <option value="">Sắp xếp</option>
          <option value={ON_SALE_VALUE}>Sản phẩm giảm giá</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {brands.length > 0 && (
          <div className="flex-1 min-w-0">
            <ScrollableBrandRow
              brands={brands}
              selectedBrands={selectedBrandSlugs}
              onToggle={(brand) =>
                toggleListParam("brands", selectedBrandSlugs, brand.slug)
              }
            />
          </div>
        )}
      </div>

      {!productSalesLoading && productSales.length > 0 && (
        <ScrollableProductRow
          products={productSales}
          title="SẢN PHẨM KHUYẾN MÃI"
        />
      )}

      {loading && <div className="h-64" />}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p className="text-center text-neutral-500 py-10">
              Không tìm thấy sản phẩm nào.
            </p>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-md hover:shadow-md transition-shadow bg-white"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => updateParam("page", String(newPage))}
          />
        </>
      )}
    </Container>
  );
}
