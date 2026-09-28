import { useRef } from "react";
import { ProductCard } from "./ProductCard";
import type { SliderHandle } from "./ui/Slider";
import Slider from "./ui/Slider";
import type { Product } from "../types/product";

interface ProductCarouselProps {
  products: Product[];
  itemsPerView?: number;
}

export default function ProductCarouselV2({
  products,
  itemsPerView = 5,
}: ProductCarouselProps) {
  const sliderRef = useRef<SliderHandle>(null);

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
        <div className="border border-neutral-200 rounded-md">
          <ProductCard key={p.id} product={p} />
        </div>
      ))}
    </Slider>
  );
}
