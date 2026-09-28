import { useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { clsx } from "clsx";
import ScrollSlider from "./ui/ScrollSlider";
import type { Brand } from "../types/brand";

export default function BrandFilterRow({ brands }: { brands: Brand[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBrandSlugs = searchParams.getAll("brandSlugs");

  function toggleBrand(slug: string) {
    const current = searchParams.getAll("brandSlugs");
    const isSelected = current.includes(slug);
    const nextSelected = isSelected
      ? current.filter((s) => s !== slug)
      : [...current, slug];

    const next = new URLSearchParams(searchParams);
    next.delete("brandSlugs");
    nextSelected.forEach((s) => next.append("brandSlugs", s));
    next.delete("page");
    setSearchParams(next);
  }

  if (brands.length === 0) return null;

  return (
    <ScrollSlider gap={4}>
      {brands.map((b) => {
        const isSelected = selectedBrandSlugs.includes(b.slug);
        if (!b.imageUrl) return;
        return (
          <div
            key={b.id}
            onClick={() => toggleBrand(b.slug)}
            className={clsx(
              "relative shrink-0 w-16 border rounded-md overflow-hidden cursor-pointer border-neutral-300",
            )}
          >
            {isSelected && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary-500 flex items-center justify-center z-10">
                <Check size={10} className="text-white" />
              </span>
            )}
            <img
              src={b.imageUrl}
              alt={b.name}
              className="w-full h-full object-contain"
            />
          </div>
        );
      })}
    </ScrollSlider>
  );
}
