import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface ScrollSliderHandle {
  next: () => void;
  prev: () => void;
}

export interface ScrollSliderProps {
  children: ReactNode;
  scrollByItems?: number; // ignored when scrollByPage is true
  scrollByPage?: boolean; // true = scroll one full visible-width at a time, regardless of item boundaries
  gap?: number;
  showArrows?: boolean;
  className?: string;
}

const ScrollSlider = forwardRef<ScrollSliderHandle, ScrollSliderProps>(
  function ScrollSlider(
    {
      children,
      scrollByItems = 1,
      scrollByPage = false,
      gap = 0,
      showArrows = true,
      className,
    },
    ref,
  ) {
    const slides = Children.toArray(children);
    const total = slides.length;

    const trackRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef(0);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    function updateArrowState() {
      const el = trackRef.current;
      if (!el) return;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }

    // Compute real state on mount + whenever content/container size changes
    // (covers: images loading late, window resize, item count changing)
    useEffect(() => {
      updateArrowState();

      const el = trackRef.current;
      if (!el) return;
      const observer = new ResizeObserver(updateArrowState);
      observer.observe(el);
      return () => observer.disconnect();
    }, [total]);

    function scrollByPageAmount(direction: 1 | -1) {
      const el = trackRef.current;
      if (!el) return;
      el.scrollBy({ left: el.clientWidth * direction, behavior: "smooth" });
    }

    function scrollToItemIndex(index: number) {
      const el = trackRef.current;
      const clamped = Math.min(Math.max(index, 0), total - 1);
      indexRef.current = clamped;

      const target = el?.children[clamped] as HTMLElement | undefined;
      if (target && el) {
        el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
      }
    }

    function next() {
      if (scrollByPage) scrollByPageAmount(1);
      else scrollToItemIndex(indexRef.current + scrollByItems);
    }

    function prev() {
      if (scrollByPage) scrollByPageAmount(-1);
      else scrollToItemIndex(indexRef.current - scrollByItems);
    }

    useImperativeHandle(ref, () => ({ next, prev }));

    if (total === 0) return null;

    return (
      <div className={clsx("relative w-full", className)}>
        <div
          ref={trackRef}
          onScroll={updateArrowState}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide items-center"
          style={{ gap: `${gap}px` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="shrink-0 snap-start">
              {slide}
            </div>
          ))}
        </div>

        {showArrows && canPrev && (
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/70 shadow hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {showArrows && canNext && (
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/70 shadow hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    );
  },
);

export default ScrollSlider;
