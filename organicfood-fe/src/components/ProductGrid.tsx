import clsx from "clsx";
import { useProducts } from "../hooks/useProducts";
import type { ProductFilter } from "../services/productService";
import Spinner from "./ui/Spinner";
import { ProductCard } from "./ProductCard";
import Slider from "./ui/Slider";

const GRID_COL_CLASS: Record<number, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

interface ProductGridProps {
  rows?: number;
  columns?: number;
  filter: ProductFilter;
}

export default function ProductGrid({
  rows = 2,
  columns = 5,
  filter,
}: ProductGridProps) {
  const { products, isLoading, error } = useProducts(filter);

  const gridColsClass = GRID_COL_CLASS[columns] ?? GRID_COL_CLASS[5];

  const productsPerSlide = rows * columns;

  const slides = Array.from(
    { length: Math.ceil(products.length / productsPerSlide) },
    (_, slideIndex) =>
      products.slice(
        slideIndex * productsPerSlide,
        (slideIndex + 1) * productsPerSlide,
      ),
  );

  if (isLoading || error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner text="" />
      </div>
    );
  }

  return (
    <Slider loop={false} showDots={false} className="py-1">
      {slides.map((slide, slideIndex) => (
        <div key={slideIndex} className={clsx("grid gap-4", gridColsClass)}>
          {slide.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ))}
    </Slider>
  );
}
