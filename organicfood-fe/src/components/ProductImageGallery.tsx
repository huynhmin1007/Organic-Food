import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import ScrollSlider from "./ui/ScrollSlider";
import clsx from "clsx";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({
  images,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  function goTo(index: number) {
    const next = ((index % images.length) + images.length) % images.length;
    setActiveIndex(next);
  }

  if (images.length === 0) return null;

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < images.length - 1;

  return (
    <div className="bg-white rounded-md space-y-3">
      <div className="relative aspect-[4/3] rounded-t-md overflow-hidden">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="w-full h-full shrink-0 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={img}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

        {canPrev && (
          <button
            aria-label="Ảnh trước"
            onClick={() => goTo(activeIndex - 1)}
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 h-[30%] w-7 rounded-l-lg bg-neutral-500/40 hover:bg-neutral-500/60 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {canNext && (
          <button
            aria-label="Ảnh sau"
            onClick={() => goTo(activeIndex + 1)}
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 h-[30%] w-7 rounded-l-lg bg-neutral-500/40 hover:bg-neutral-500/60 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {activeIndex + 1}/{images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <ScrollSlider gap={8}>
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={clsx(
                "cursor-pointer shrink-0 w-28 h-28 rounded-md border-2 transition-opacity hover:opacity-80",
                activeIndex === index
                  ? "border-primary-500 opacity-100"
                  : "border-neutral-200 opacity-50",
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </ScrollSlider>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            aria-label="Đóng"
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={28} />
          </button>

          {canPrev && (
            <button
              aria-label="Ảnh trước"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {canNext && (
            <button
              aria-label="Ảnh sau"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <img
            src={images[activeIndex]}
            alt={`Ảnh ${activeIndex + 1}`}
            className="max-h-[90vh] max-w-full object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
