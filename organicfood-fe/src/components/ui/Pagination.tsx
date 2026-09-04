import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number; // 0-based
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="p-2 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-md border text-sm ${
              p === page
                ? "bg-primary-500 text-white border-primary-500"
                : "hover:bg-neutral-50"
            }`}
          >
            {(p as number) + 1}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="p-2 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
        aria-label="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function getPageList(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];
  const left = Math.max(0, current - delta);
  const right = Math.min(total - 1, current + delta);

  if (left > 0) {
    range.push(0);
    if (left > 1) range.push("...");
  }
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) {
    if (right < total - 2) range.push("...");
    range.push(total - 1);
  }
  return range;
}
