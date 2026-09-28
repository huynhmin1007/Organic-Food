import { useRef } from "react";
import { useProducts } from "../hooks/useProducts";
import type { ProductFilter } from "../services/productService";
import Spinner from "./ui/Spinner";
import { ProductCard } from "./ProductCard";
import type { SliderHandle } from "./ui/Slider";
import Slider from "./ui/Slider";
import type { Product } from "../types/product";

interface ProductCarouselProps {
  products?: Product[];
  filter: ProductFilter;
  itemsPerView?: number;
}

export default function ProductCarousel({
  filter,
  itemsPerView = 5,
}: ProductCarouselProps) {
  const { products, isLoading, error } = useProducts(filter);
  const sliderRef = useRef<SliderHandle>(null);

  if (isLoading || error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner text="" />
      </div>
    );
  }

  return (
    <Slider
      ref={sliderRef}
      itemsPerView={itemsPerView}
      scrollBy={itemsPerView}
      gap={16}
      className="py-1"
      loop={false}
      showDots={false}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </Slider>
  );
}
