import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface SliderHandle {
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
}

export interface SliderProps {
  children: ReactNode;
  itemsPerView?: number;
  scrollBy?: number; // how many items to move per next/prev (default = itemsPerView, "page" scroll)
  gap?: number;
  loop?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const Slider = forwardRef<SliderHandle, SliderProps>(function Slider(
  {
    children,
    itemsPerView = 1,
    scrollBy = itemsPerView,
    gap = 0,
    loop = itemsPerView === 1,
    showDots = true,
    showArrows = true,
    className,
  },
  ref,
) {
  const slides = Children.toArray(children);
  const total = slides.length;
  const maxIndex = Math.max(0, total - itemsPerView); // last valid "start item" index

  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0); // current START ITEM index, not "slide number"
  const [activeIndex, setActiveIndex] = useState(0);

  const itemWidth = `calc((100% - ${gap * (itemsPerView - 1)}px) / ${itemsPerView})`;
  const stepDistance = `calc(${itemWidth} + ${gap}px)`;

  function applyTransform(index: number) {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(calc(-1 * ${index} * ${stepDistance}))`;
    }
  }

  function clampOrLoop(index: number) {
    if (loop) return ((index % total) + total) % total;
    return Math.min(Math.max(index, 0), maxIndex);
  }

  function goTo(index: number) {
    const next = clampOrLoop(index);
    indexRef.current = next;
    applyTransform(next);
    setActiveIndex(next);
  }

  useImperativeHandle(ref, () => ({
    goTo,
    next: () => goTo(indexRef.current + scrollBy),
    prev: () => goTo(indexRef.current - scrollBy),
  }));

  if (total === 0) return null;

  const canPrev = loop || indexRef.current > 0;
  const canNext = loop || indexRef.current < maxIndex;

  return (
    <div className={clsx("relative w-full overflow-hidden", className)}>
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-out"
        style={{
          gap: `${gap}px`,
          transform: `translateX(calc(-1 * ${indexRef.current} * ${stepDistance}))`,
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="shrink-0" style={{ width: itemWidth }}>
            {slide}
          </div>
        ))}
      </div>

      {showArrows && total > itemsPerView && (
        <>
          {canPrev && (
            <button
              aria-label="Previous"
              onClick={() => goTo(indexRef.current - scrollBy)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/70 shadow hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {canNext && (
            <button
              aria-label="Next"
              onClick={() => goTo(indexRef.current + scrollBy)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/70 shadow hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </>
      )}

      {showDots && itemsPerView === 1 && total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={clsx(
                "h-2 rounded-full transition-all",
                i === activeIndex
                  ? "w-6 bg-primary-600"
                  : "w-2 bg-white/70 hover:bg-white",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default Slider;
