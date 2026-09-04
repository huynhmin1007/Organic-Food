import { Link } from "react-router-dom";
import banner1 from "../../assets/banner_1.webp";
import banner2 from "../../assets/banner_2.webp";
import banner3 from "../../assets/banner_3.webp";
import banner4 from "../../assets/banner_4.webp";

type Banner = {
  id: number;
  imageUrl: string;
};

const FAKE_BANNERS: Banner[] = [
  {
    id: 1,
    imageUrl: banner1,
  },
  {
    id: 1,
    imageUrl: banner2,
  },
  {
    id: 1,
    imageUrl: banner3,
  },
  {
    id: 1,
    imageUrl: banner4,
  },
];

export default function BannerSection() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {FAKE_BANNERS.map((banner) => (
        <Link key={banner.id} to={"/"} className="group overflow-hidden">
          <img
            src={banner.imageUrl}
            alt=""
            className="w-full aspect-[16/7] object-cover 
                    transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      ))}
    </div>
  );
}
