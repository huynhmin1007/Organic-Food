import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import type { ProductFilterRequest } from "../../lib/types/product";
import { useProductList } from "../../hooks/useProduct";

type ProductCarouselProps = {
  title?: string;
  filter?: Omit<ProductFilterRequest, "page">;
  itemPerSlide?: number;
  totalItems?: number;
  className?: string;
  classNameForCard?: string;
  excludeProduct?: string;
};

const GRID_COLS_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function ProductCarousel({
  title,
  filter,
  itemPerSlide = 5,
  totalItems = 20,
  className = "",
  classNameForCard = "",
  excludeProduct = "",
}: ProductCarouselProps) {
  const {
    products: rawProducts,
    loading,
    error,
  } = useProductList({
    ...filter,
    size: totalItems,
  });

  const products = excludeProduct
    ? rawProducts.filter((p) => p.id !== excludeProduct)
    : rawProducts;

  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = Math.ceil(products.length / itemPerSlide);
  const gridColsClass = GRID_COLS_CLASS[itemPerSlide] ?? GRID_COLS_CLASS[5];

  const goPrev = () => setSlideIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setSlideIndex((i) => Math.min(i + 1, totalSlides - 1));

  if (loading) return <div className="h-64" />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (products.length === 0) return null;

  return (
    <div className={className}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slide) => (
              <div
                key={slide}
                className={`grid ${gridColsClass} gap-4 shrink-0 w-full`}
              >
                {products
                  .slice(
                    slide * itemPerSlide,
                    slide * itemPerSlide + itemPerSlide,
                  )
                  .map((p) => (
                    <div
                      key={p.id}
                      className={`rounded-md hover:shadow-md transition-shadow ${classNameForCard}`}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {slideIndex > 0 && (
          <button
            onClick={goPrev}
            aria-label="Trượt trái"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                       bg-white border rounded-full p-2 shadow hover:bg-gray-50"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {slideIndex < totalSlides - 1 && (
          <button
            onClick={goNext}
            aria-label="Trượt phải"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                       bg-white border rounded-full p-2 shadow hover:bg-gray-50"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to={"/"}
          className="border rounded-md px-4 py-2 border-primary-500 text-primary-500
                     hover:text-white hover:bg-primary-500 transition-colors
                     inline-flex items-center w-36"
        >
          <Link to={`/${filter?.categorySlugs}`}>
            <span className="flex-1 text-center">Xem tất cả</span>
          </Link>
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
