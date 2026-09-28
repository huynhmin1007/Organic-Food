import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  className,
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className={clsx("flex items-center justify-center gap-1", className)}>
      <button
        aria-label="Prev page"
        disabled={currentPage === 0}
        onClick={() => goToPage(currentPage - 1)}
        className="cursor-pointer h-9 w-9 flex items-center justify-center rounded-md border border-stone-200 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>

      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 text-center text-stone-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={clsx(
              "cursor-pointer h-9 w-9 rounded-md text-sm font-medium",
              p === currentPage
                ? "bg-primary-500 text-white"
                : "border border-stone-200 hover:bg-stone-50",
            )}
          >
            {p + 1}{" "}
          </button>
        ),
      )}

      <button
        aria-label="Next page"
        disabled={currentPage === totalPages - 1}
        onClick={() => goToPage(currentPage + 1)}
        className="cursor-pointer h-9 w-9 flex items-center justify-center rounded-md border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];
  const rangeStart = Math.max(0, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  if (rangeStart > 0) {
    range.push(0);
    if (rangeStart > 1) range.push("...");
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    range.push(i);
  }

  if (rangeEnd < total - 1) {
    if (rangeEnd < total - 2) range.push("...");
    range.push(total - 1);
  }

  return range;
}
