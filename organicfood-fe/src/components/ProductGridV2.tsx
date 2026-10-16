import clsx from "clsx";
import { useProducts } from "../hooks/useProducts";
import type { ProductFilter } from "../services/productService";
import Spinner from "./ui/Spinner";
import { ProductCard } from "./ProductCard";
import Slider from "./ui/Slider";
import type { Product } from "../types/product";

const GRID_COL_CLASS: Record<number, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

interface ProductGridProps {
  rows?: number;
  columns?: number;
  products: Product[];
}

export default function ProductGridV2({
  rows = 2,
  columns = 5,
  products,
}: ProductGridProps) {
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

  return (
    <Slider loop={false} showDots={false} className="py-1">
      {slides.map((slide, slideIndex) => (
        <div
          key={slideIndex}
          className={clsx("grid gap-4 h-full", gridColsClass)}
        >
          {slide.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ))}
    </Slider>
  );
}
