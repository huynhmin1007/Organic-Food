import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import type { PageResponse } from "../types/api";
import type { Product } from "../types/product";
import {
  BadgePercent,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Container from "../components/ui/Container";
import { useCategoryContext } from "../context/CategoryContext";
import { useRef, useState } from "react";
import clsx from "clsx";
import CategoryMenuPanel from "../components/CategoryMenuPanel";
import type {
  ProductFilter,
  ProductSortType,
} from "../services/productService";
import CategoryFilterTree from "../components/CategoryFilterTree";
import { findCategoryBySlug, findSimilarCategories } from "../lib/category";
import ProductCardRow from "../components/ProductCardRow";
import { ProductCard } from "../components/ProductCard";
import Pagination from "../components/ui/Pagination";
import { useBrands } from "../hooks/useBrands";
import BrandFilterRow from "../components/BrandFilterRow";

interface ProductListLoaderData {
  products: PageResponse<Product>;
  saleProducts: PageResponse<Product>;
  filter: ProductFilter;
}

const PRODUCT_SORT_OPTIONS: { value: ProductSortType; label: string }[] = [
  // { value: "BEST_SELLING_WEEKLY", label: "Bán chạy tuần" },
  // { value: "BEST_SELLING_MONTHLY", label: "Bán chạy tháng" },
  { value: "PRICE_ASC", label: "Giá thấp đến cao" },
  { value: "PRICE_DESC", label: "Giá cao đến thấp" },
  { value: "NAME_ASC", label: "Tên A-Z" },
  { value: "NAME_DESC", label: "Tên Z-A" },
];

export default function ProductListPage() {
  const { products, saleProducts, filter } =
    useLoaderData() as ProductListLoaderData;
  const { categories } = useCategoryContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "";

  const searchKeyword = filter.keyword ?? undefined;
  const categorySlug = searchParams.get("categorySlug") ?? undefined;
  const similar = findSimilarCategories(categories, searchKeyword);

  const { brands } = useBrands({
    includeDescendants: true,
    categorySlug: categorySlug ?? similar[0]?.slug,
  });

  const activeCategory = findCategoryBySlug(categories, categorySlug);

  const saleTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function checkScrollButtons() {
    const el = saleTrackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  }

  function scrollSale(direction: 1 | -1) {
    saleTrackRef.current?.scrollBy({
      left: saleTrackRef.current.clientWidth * direction,
      behavior: "smooth",
    });
  }

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams);
    if (e.target.value) {
      next.set("sort", e.target.value);
    } else {
      next.delete("sort");
    }
    next.delete("page");
    setSearchParams(next);
  }

  return (
    <Container className="flex">
      <aside className="w-64 h-fit shrink-0 rounded-md bg-white">
        <CategoryMenuPanel categories={categories} />
      </aside>
      <div className="flex flex-col flex-1 min-w-0 ml-5">
        <div className="bg-white flex items-center rounded-md py-2 px-3 gap-4">
          <ChevronLeft size={24} />
          <span>
            {searchKeyword ?? activeCategory?.name ?? "Tất cả sản phẩm"}
          </span>
        </div>
        <div className="mt-5">
          <CategoryFilterTree />
        </div>

        <div className="mt-5 bg-white rounded-md flex px-3 py-2 gap-2 items-center">
          <select
            value={currentSort}
            onChange={handleSort}
            className="border rounded-md px-3 py-2 text-sm shrink-0"
          >
            <option value="">Sắp xếp</option>
            {PRODUCT_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {brands?.length > 0 && <BrandFilterRow brands={brands} />}
        </div>

        {saleProducts.content.length > 0 && (
          <div className="mt-5">
            <div className="bg-gradient-to-b from-[#4AC15C] to-[#B4FFBF] rounded-xl">
              <h2 className="text-white font-bold text-lg pt-4 px-2">
                SẢN PHẨM KHUYẾN MÃI
              </h2>

              <div className="relative px-2 py-4">
                <div
                  ref={saleTrackRef}
                  onScroll={checkScrollButtons}
                  onLoad={checkScrollButtons}
                  className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
                >
                  {saleProducts.content.map((p) => (
                    <div
                      key={p.id}
                      className="shrink-0 w-[calc((100%-24px)/3)]"
                    >
                      <ProductCardRow product={p} className="h-36" />
                    </div>
                  ))}
                </div>

                {canScrollLeft && (
                  <button
                    onClick={() => scrollSale(-1)}
                    className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 h-[50%] w-7 rounded-l-lg bg-neutral-500/40 hover:bg-neutral-500/60 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                {canScrollRight && (
                  <button
                    onClick={() => scrollSale(1)}
                    className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-7 rounded-l-lg bg-neutral-500/40 hover:bg-neutral-500/60 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {products.content.length > 0 && (
          <div>
            <div className="mt-5 grid grid-cols-4 gap-3">
              {products.content.map((p) => (
                <div className="bg-white">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <Pagination
              currentPage={products.page}
              totalPages={products.totalPages}
              className="mt-5"
            />
          </div>
        )}

        {products.content.length <= 0 && (
          <div className="rounded-md mt-5 bg-white h-64 w-full flex items-center justify-center">
            <span className="text-lg">Không tìm thấy sản phẩm phù hợp!</span>
          </div>
        )}
      </div>
    </Container>
  );
}
