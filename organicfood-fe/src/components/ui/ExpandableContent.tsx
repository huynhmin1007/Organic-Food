import { useRef, useState, useLayoutEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ExpandableContentProps = {
  children: React.ReactNode;
  collapsedHeight?: number; // px, chiều cao khi thu gọn
};

export default function ExpandableContent({
  children,
  collapsedHeight = 200,
}: ExpandableContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setNeedsExpand(el.scrollHeight > collapsedHeight);
  }, [children, collapsedHeight]);

  return (
    <div>
      <div
        className="relative overflow-hidden transition-[max-height] duration-300 ease-out"
        style={{
          maxHeight: expanded
            ? contentRef.current?.scrollHeight
            : collapsedHeight,
        }}
      >
        <div ref={contentRef}>{children}</div>

        {!expanded && needsExpand && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {needsExpand && (
        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-primary-500 text-sm font-medium hover:underline"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
