import type { LoaderFunctionArgs } from "react-router-dom";
import { parseProductFilter } from "../lib/parseProductFilter";
import { getProducts } from "../services/productService";

export async function productListLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = parseProductFilter(url.searchParams);
  const [products, saleProducts] = await Promise.all([
    getProducts(filter),
    getProducts({
      categorySlugs: filter.categorySlugs,
      keyword: filter.keyword,
      onSale: true,
      size: 10,
      includeDescendants: true,
    }),
  ]);
  return { products, saleProducts, filter };
}
