import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import type { ProductFilterRequest } from "../../lib/types/product";
import { useProductList } from "../../hooks/useProduct";

// Map cố định để Tailwind quét thấy class lúc build (không dùng template string động)
const GRID_COLS_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

type ProductGridProps = {
  title?: string;
  filter?: Omit<ProductFilterRequest, "page" | "size">;
  viewAllHref?: string;
  columns?: number;
  count?: number;
};

export default function ProductGrid({
  title,
  filter = {},
  viewAllHref = "/",
  columns = 5,
  count = 10,
}: ProductGridProps) {
  const { products, loading, error } = useProductList({
    ...filter,
    size: count,
  });

  const gridColsClass = GRID_COLS_CLASS[columns] ?? GRID_COLS_CLASS[5];

  if (loading) return <div className="h-64" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

      <div className={`grid ${gridColsClass} gap-4`}>
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-md hover:shadow-md transition-shadow"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to={viewAllHref}
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
