import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface ExpandableSectionProps {
  children: ReactNode;
  collapsedHeight?: number;
}

export default function ExpandableSection({
  children,
  collapsedHeight = 400,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: isExpanded ? "10000px" : `${collapsedHeight}px` }}
      >
        {children}
      </div>

      {!isExpanded && (
        <div className="absolute bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="cursor-pointer w-full flex items-center justify-center gap-1 py-2 text-primary-600 font-medium text-sm hover:text-primary-700"
      >
        {isExpanded ? "Thu gọn" : "Xem thêm"}
        <ChevronDown
          size={16}
          className={clsx("transition-transform", isExpanded && "rotate-180")}
        />
      </button>
    </div>
  );
}
