import type {
  ProductFilter,
  ProductSortType,
} from "../services/productService";

export function parseProductFilter(
  searchParams: URLSearchParams,
): ProductFilter {
  const filter: ProductFilter = {
    page: parseIntOrUndefined(searchParams.get("page")) ?? 0,
    size: parseIntOrUndefined(searchParams.get("size")) ?? 12,
  };

  const categorySlug = searchParams.get("categorySlug");
  const subCategorySlugs = searchParams.getAll("categorySlugs");
  if (subCategorySlugs.length > 0) {
    filter.categorySlugs = subCategorySlugs;
  } else if (categorySlug) {
    filter.categorySlugs = [categorySlug];
  }

  const brandSlugs = searchParams.getAll("brandSlugs");
  if (brandSlugs.length > 0) filter.brandSlugs = brandSlugs;

  const keyword = searchParams.get("keyword");
  if (keyword) filter.keyword = keyword;

  const minPrice = parseIntOrUndefined(searchParams.get("minPrice"));
  if (minPrice !== undefined) filter.minPrice = minPrice;

  const maxPrice = parseIntOrUndefined(searchParams.get("maxPrice"));
  if (maxPrice !== undefined) filter.maxPrice = maxPrice;

  const onSale = searchParams.get("onSale");
  if (onSale !== null) filter.onSale = onSale === "true";

  const sort = searchParams.get("sort");
  if (sort) filter.sort = sort as ProductSortType;

  filter.includeDescendants = true;

  return filter;
}

function parseIntOrUndefined(value: string | null): number | undefined {
  if (value === null) return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}
