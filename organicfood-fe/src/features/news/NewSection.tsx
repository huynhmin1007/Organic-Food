import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import banner from "../../assets/news_1.webp";

type Article = {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
};

const FAKE_ARTICLES: Article[] = [
  {
    id: 1,
    title:
      "Organicfood.vn vinh dự đồng hành cùng Hiệp hội Hữu cơ Việt Nam (VOAA) tại sự kiện Horti Agri Next Asia 2026",
    date: "Th 5 21/05/2026",
    excerpt:
      "Sáng ngày 20/5/2026, Organicfood vinh dự đón TS. Phùng Đức Tiến, Đại biểu Quốc hội khóa XVI, Nguyên Thứ trưởng Bộ Nông nghiệp và Môi trường...",
    imageUrl: "https://picsum.photos/seed/news1/600/400",
    slug: "organicfood-horti-agri-next-asia-2026",
  },
  {
    id: 2,
    title:
      "ORGANIC FOOD VINH DỰ ĐÓN TIẾP ĐOÀN VOAA & NATURLAND ĐẾN THĂM VÀ LÀM VIỆC",
    date: "Th 4 13/05/2026",
    excerpt:
      "Ngày 13/05/2026, Organic Food hân hạnh chào đón đoàn công tác từ VOAA (Hiệp hội Nông nghiệp Hữu cơ Việt Nam) và Naturland – Đức...",
    imageUrl: "https://picsum.photos/seed/news2/200/200",
    slug: "organic-food-don-tiep-voaa-naturland",
  },
  {
    id: 3,
    title: "LỜI CẢM ƠN TỪ NHÀ ORG – ",
    date: "CN 03/05/2026",
    excerpt:
      "Nhà Org xin gửi lời cảm ơn chân thành đến Hiệp hội Nông nghiệp hữu cơ Việt Nam và chương trình đã...",
    imageUrl: "https://picsum.photos/seed/news3/200/200",
    slug: "loi-cam-on-uom-mam-huu-co",
  },
  {
    id: 4,
    title:
      "Quà tặng cực chất từ OrganicFood.vn – Mua 1 yến mạch hữu cơ Bob's Red Mill tặng ly cách nhiệt",
    date: "Th 6 17/04/2026",
    excerpt:
      "Quà tặng cực chất từ OrganicFood.vn – Mua 1 yến mạch hữu cơ Bob's Red Mill tặng ly cách nhiệt. Nhằm mang đến trải nghiệm tốt...",
    imageUrl: "https://picsum.photos/seed/news4/200/200",
    slug: "qua-tang-yen-mach-bob-red-mill",
  },
  {
    id: 5,
    title:
      "Ưu Đãi Tuần Này Tại Organic Food – Mua Ngay Thực Phẩm Organic Giá Tốt",
    date: "Th 3 17/03/2026",
    excerpt:
      "Ưu Đãi Tuần Này Tại Organic Food Có Gì Hấp Dẫn? Nếu các mom đang tìm một chương trình khuyến mãi thực phẩm organic để mua...",
    imageUrl: "https://picsum.photos/seed/news5/200/200",
    slug: "uu-dai-tuan-nay-organic-food",
  },
];

export default function NewsSection({
  viewAllHref = "/blogs/news",
}: {
  viewAllHref?: string;
}) {
  const [featured, ...rest] = FAKE_ARTICLES;

  return (
    <div>
      {/* Header section: title + xem tất cả */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-4">
        <h2 className="text-2xl font-bold text-primary-500">
          Bạn Không Nên Bỏ Lỡ
        </h2>
        <Link
          to={viewAllHref}
          className="flex items-center gap-1 text-primary-500 hover:text-primary-600
                     font-medium text-md transition-colors"
        >
          Xem tất cả <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Cột trái: bài featured */}
        <Link
          to={`/blogs/news/${featured.slug}`}
          className="w-[42%] shrink-0 group"
        >
          <div className="overflow-hidden rounded-lg">
            <img
              src={banner}
              alt={featured.title}
              className="w-full aspect-[4/3] object-cover
                         group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3
            className="text-lg font-bold text-neutral-800 mt-3
                         group-hover:text-primary-500 transition-colors line-clamp-3"
          >
            {featured.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">{featured.date}</p>
          <p className="text-sm text-neutral-600 mt-2 line-clamp-3">
            {featured.excerpt}
          </p>
          <span className="text-primary-500 text-sm hover:underline mt-1 inline-block">
            Đọc tiếp
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px bg-primary-500 shrink-0" />

        {/* Cột phải: list bài nhỏ */}
        <div className="flex-1 flex flex-col divide-y divide-neutral-100">
          {rest.map((article) => (
            <Link
              key={article.id}
              to={`/blogs/news/${article.slug}`}
              className="flex gap-4 py-4 first:pt-0 last:pb-0 group"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 shrink-0 overflow-hidden rounded-md">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover
                             group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-bold text-neutral-800 line-clamp-2
                               group-hover:text-primary-500 transition-colors"
                >
                  {article.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">{article.date}</p>
                <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="text-primary-500 text-sm mt-1 inline-block">
                  Đọc tiếp
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
