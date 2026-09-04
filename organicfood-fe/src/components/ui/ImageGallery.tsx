import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeIndex]);

  if (images.length === 0) return null;

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setActiveIndex((i) => Math.min(images.length - 1, i + 1));

  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      {/* Ảnh chính */}
      <div className="relative overflow-hidden aspect-[4/3] max-w-2xl mx-auto">
        {/* Track — chỉ chứa ảnh, đây là phần dịch chuyển */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${alt} ${idx + 1}`}
              className="w-full h-full object-contain shrink-0"
            />
          ))}
        </div>

        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
          {activeIndex + 1}/{images.length}
        </span>
      </div>

      {activeIndex > 0 && (
        <button
          onClick={goPrev}
          aria-label="Ảnh trước"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[30%] w-7 rounded-r-lg
                       bg-neutral-500/40 hover:bg-neutral-500/60 text-white
                       flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {activeIndex < images.length - 1 && (
        <button
          onClick={goNext}
          aria-label="Ảnh sau"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[30%] w-7 rounded-l-lg
                       bg-neutral-500/40 hover:bg-neutral-500/60 text-white
                       flex items-center justify-center transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Thumbnail */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {images.map((img, idx) => (
            <button
              key={idx}
              ref={(el) => (thumbRefs.current[idx] = el)}
              onClick={() => setActiveIndex(idx)}
              className={`shrink-0 w-28 h-28 rounded-md overflow-hidden border-2 transition-opacity ${
                idx === activeIndex
                  ? "border-primary-500 opacity-100"
                  : "border-neutral-200 opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={img}
                alt={`${alt} ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
