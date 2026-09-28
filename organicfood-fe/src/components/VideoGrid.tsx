import { ChevronRight, Play, X } from "lucide-react";
import { useState } from "react";

interface VideoReview {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
}

const REVIEWS: VideoReview[] = [
  {
    id: 1,
    thumbnailUrl: "https://img.youtube.com/vi/VjtLui5yBi4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/VjtLui5yBi4",
    title: "Bộ 3 sản phẩm nhà Altavie cho Sức khoẻ mỗi ngày",
  },
  {
    id: 2,
    thumbnailUrl: "https://img.youtube.com/vi/7jcLbIHOqDw/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/7jcLbIHOqDw",
    title: "Hạt Điều Hữu Cơ Altaive Thật Sự Ngon",
  },
  {
    id: 3,
    thumbnailUrl: "https://img.youtube.com/vi/Ns1izsVmilg/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/Ns1izsVmilg",
    title: "Bạn đã thử cà phê hữu cơ Robusta chưa?",
  },
  {
    id: 4,
    thumbnailUrl: "https://img.youtube.com/vi/AaMz5Rwc914/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/AaMz5Rwc914",
    title: "Siro mật cây thùa bạn thử chưa?",
  },
  {
    id: 5,
    thumbnailUrl: "https://img.youtube.com/vi/tYGWLJF0B8E/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/tYGWLJF0B8E",
    title: "Kiwi Organic bao ngọt nha",
  },
  {
    id: 6,
    thumbnailUrl: "https://img.youtube.com/vi/fFLGjZsKrbA/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/fFLGjZsKrbA",
    title: "Cá hồi hữu cơ nhà O, bao ngon nha",
  },
  {
    id: 7,
    thumbnailUrl: "https://img.youtube.com/vi/-y-HEd44mMc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/-y-HEd44mMc",
    title: "Táo đỏ và táo đen, táo nào tốt hơn?",
  },
  {
    id: 8,
    thumbnailUrl: "https://img.youtube.com/vi/a4QAUeClqVc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/a4QAUeClqVc",
    title: "Táo đỏ và táo đen, táo nào tốt hơn?",
  },
];

export default function VideoGrid() {
  const [activeVideo, setActiveVideo] = useState<VideoReview | null>(null);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {REVIEWS.map((r) => (
          <div
            key={r.id}
            onClick={() => setActiveVideo(r)}
            className="group relative block w-full aspect-9/16 rounded-lg overflow-hidden text-left cursor-pointer bg-black
               transition-transform duration-300 hover:-translate-y-1"
          >
            <img
              src={r.thumbnailUrl}
              alt={r.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                 h-10 w-10 flex items-center justify-center bg-white rounded-full
                 text-primary-600"
            >
              <Play size={16} fill="currentColor" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-14 px-4 pb-3 flex items-end">
              <span className="text-sm font-medium line-clamp-2 text-white">
                {r.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            aria-label="Đóng"
            className="absolute top-4 right-4 text-white"
            onClick={() => setActiveVideo(null)}
          >
            <X size={28} />
          </button>

          <div
            className="relative w-full max-w-[400px] aspect-9/16 rounded-lg overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {getYoutubeEmbedUrl(activeVideo.videoUrl) && (
              <iframe
                src={getYoutubeEmbedUrl(activeVideo.videoUrl)!}
                title={activeVideo.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getYoutubeEmbedUrl(url: string): string | null {
  // Handles: youtube.com/shorts/ID, youtube.com/watch?v=ID, youtu.be/ID
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }

  return null;
}
