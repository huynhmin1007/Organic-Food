import { useSearchParams } from "react-router-dom";
import { useCategoryContext } from "../context/CategoryContext";
import type { Category } from "../types/category";
import clsx from "clsx";
import { Check, ChevronLeft } from "lucide-react";
import { findCategoryBySlug, findCategoryPathBySlug } from "../lib/category";
import Slider from "./ui/Slider";
import ScrollSlider from "./ui/ScrollSlider";

export default function CategoryFilterTree() {
  const { categories } = useCategoryContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategorySlug = searchParams.get("categorySlug") ?? undefined;
  const selectedSubSlugs = searchParams.getAll("categorySlugs");

  const path = findCategoryPathBySlug(categories, activeCategorySlug);

  const level1Categories = path[0]?.children ?? [];
  const level1Active = path[1];
  const level2Categories = level1Active?.children ?? [];

  function selectCategory(slug: string) {
    const next = new URLSearchParams(searchParams);
    next.set("categorySlug", slug);
    next.delete("categorySlugs");
    next.delete("page");
    setSearchParams(next);
  }

  function toggleSubCategory(slug: string) {
    const current = searchParams.getAll("categorySlugs");
    const isSelected = current.includes(slug);
    const nextSelected = isSelected
      ? current.filter((s) => s !== slug)
      : [...current, slug];

    const next = new URLSearchParams(searchParams);
    next.delete("categorySlugs");
    nextSelected.forEach((s) => next.append("categorySlugs", s));
    next.delete("page");
    setSearchParams(next);
  }

  return (
    <div className="flex flex-col gap-5">
      <ScrollSlider
        className="rounded-md bg-white px-3 py-2"
        gap={16}
        scrollByPage={true}
      >
        {level1Categories.map((c) => {
          const isActive = c.slug === level1Active?.slug;
          return (
            <div
              key={c.id}
              className={clsx(
                "shrink-0 flex flex-col gap-1 p-2 items-center justify-center border cursor-pointer rounded-md w- h-full text-center hover:border-primary-500 hover:bg-primary-100 transition-colors",
                isActive
                  ? "border-primary-500 text-primary-500"
                  : "border-stone-200",
              )}
              onClick={() => selectCategory(c.slug)}
            >
              <img
                src={c.imageUrl}
                alt={c.name}
                className="w-16 h-16 object-contain"
              />
              <span className="text-sm">{c.name}</span>
            </div>
          );
        })}
      </ScrollSlider>

      {level2Categories.length > 0 && (
        <div className="rounded-md bg-white flex gap-4 px-3 py-2">
          <ScrollSlider gap={16} scrollByPage={true}>
            {level2Categories.map((c) => {
              const isSelected = selectedSubSlugs.includes(c.slug);
              return (
                <div
                  key={c.id}
                  className={clsx(
                    "relative shrink-0 flex flex-col gap-1 p-2 items-center justify-center border cursor-pointer rounded-md min-w-[72px] text-center hover:border-primary-500 hover:bg-primary-100 transition-colors",
                    isSelected
                      ? "border-primary-500 text-primary-500"
                      : "border-stone-200",
                  )}
                  onClick={() => toggleSubCategory(c.slug)}
                >
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <span className="text-sm">{c.name}</span>
                  {isSelected && (
                    <div className="absolute top-0.5 right-0.5 bg-primary-500 text-white rounded-full p-0.5">
                      <Check size={10} className="" />
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollSlider>
        </div>
      )}
    </div>
  );
}
