import bannerLeft from "../../assets/stk-bn-left.webp";
import bannerRight from "../../assets/stk-bn-right.webp";

type SideBannerProps = {
  className?: string;
};

export default function SideBanners({ className = "" }: SideBannerProps) {
  return (
    <div className={className}>
      <div className="fixed left-5 top-[260px] z-40 hidden xl:block">
        <img
          src={bannerLeft}
          alt="Banner trái"
          className="w-24 object-cover shadow-md"
        />
      </div>

      <div className="fixed right-5 top-[260px] z-40 hidden xl:block">
        <img
          src={bannerRight}
          alt="Banner phải"
          className="w-24 object-cover shadow-md"
        />
      </div>
    </div>
  );
}
