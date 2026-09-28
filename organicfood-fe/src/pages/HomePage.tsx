import Container from "../components/ui/Container";
import brand1 from "../assets/brand_1.webp";
import brand2 from "../assets/brand_2.webp";
import brand3 from "../assets/brand_3.webp";
import brand4 from "../assets/brand_4.webp";
import sectionHotBanner from "../assets/section_hot_banner_2048x2048.webp";
import sectionMemberBanner from "../assets/section_member_banner.webp";
import member1 from "../assets/banner_member_1.webp";
import member2 from "../assets/banner_member_2.webp";
import member3 from "../assets/banner_member_3.webp";
import member4 from "../assets/banner_member_4.webp";
import Section from "../components/ui/Section";
import ProductCarousel from "../components/ProductCarousel";
import Button from "../components/ui/Button";
import { ChevronRight, ShoppingCart } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import VideoGrid from "../components/VideoGrid";
import Slider from "../components/ui/Slider";
import NewsSection from "../components/NewSection";

const BRANDS = [brand1, brand2, brand3, brand4];

interface Member {
  id: number;
  name: string;
  banner: string;
  price: number;
  sale: number;
}

const MEMBERS: Member[] = [
  {
    id: 1,
    name: "Gói thành viên orgaeats",
    banner: member1,
    price: 5900000,
    sale: 5,
  },
  {
    id: 2,
    name: "Gói thành viên orgalove",
    banner: member3,
    price: 19000000,
    sale: 15,
  },
  {
    id: 3,
    name: "Gói thành viên orgalife",
    banner: member2,
    price: 39000000,
    sale: 20,
  },
];

export default function HomePage() {
  return (
    <Container className="flex flex-col space-y-8">
      <div className="flex space-x-5">
        {BRANDS.map((b, index) => (
          <div key={index} className="flex-1 min-w-0 cursor-pointer">
            <img
              src={b}
              alt={`brand ${index}`}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>

      <Section
        title="Hàng Organic Mới Về"
        to="/products?categorySlug=thit-ca-trung-rau-cu"
      >
        <ProductCarousel
          filter={{
            categorySlugs: ["rau-cu-trai-cay"],
            includeDescendants: true,
            size: 20,
          }}
        />
        <div className="w-full flex items-center justify-center mt-4">
          <Button to={`/products/${"rau-cu-trai-cay"}`} variant={"outline"}>
            Xem thêm
            <ChevronRight size={16} />
          </Button>
        </div>
      </Section>

      <Section
        title="Hàng Organic Mới Về"
        to="/products?categorySlug=thit-ca-trung-rau-cu"
      >
        <ProductGrid
          columns={5}
          rows={2}
          filter={{
            categorySlugs: ["thit-ca-trung-rau-cu"],
            includeDescendants: true,
            size: 20,
          }}
        />
        <div className="w-full flex items-center justify-center mt-4">
          <Button
            to={`/products/${"thit-ca-trung-rau-cu"}`}
            variant={"outline"}
          >
            Xem thêm
            <ChevronRight size={16} />
          </Button>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col justify-center items-center border-b border-stone-200 pb-3">
          <span className="text-primary-600 text-sm font-semibold">
            TRẢI NGHIỆM THỰC TẾ
          </span>
          <h2 className="font-semibold text-[22px]">Review Sản Phẩm</h2>
        </div>

        <VideoGrid />

        <div className="flex items-center justify-center mt-4 w-full">
          <Button to="/reviews" variant={"outline"}>
            Xem tất cả review
            <ChevronRight size={16} />
          </Button>
        </div>
      </Section>

      <div className="cursor-pointer">
        <img src={sectionHotBanner} alt="Hot banner" />
      </div>

      <Section title="GÓI THÀNH VIÊN - TIẾT KIỆM 20%">
        <div className="flex gap-6 items-start">
          <div className="w-[455px] shrink-0 cursor-pointer">
            <img src={sectionMemberBanner} alt="Member banner" />
          </div>
          <div className="flex gap-4">
            {MEMBERS.map((m) => (
              <div
                key={m.id}
                className="group flex flex-col cursor-pointer rounded-md hover:shadow-md transition-shadow"
              >
                <div className="w-full rounded-t-md aspect-square overflow-hidden relative">
                  <img
                    src={m.banner}
                    className="w-full h-full object-contain"
                  />
                  <div
                    className="absolute inset-0 bg-black/20
                        translate-y-[40%] opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-500 ease-out
                        flex items-center justify-center"
                  >
                    <button
                      className="bg-primary-500 text-white rounded-full p-3 shadow-lg
                       transition-transform hover:scale-110 cursor-pointer"
                    >
                      <ShoppingCart size={16} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col mx-2 mt-3 mb-2">
                  <h3 className="group-hover:text-primary-500 text-sm">
                    {m.name}
                  </h3>
                  <span className="text-primary-500 text-sm">
                    {m.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <NewsSection />
      </Section>
    </Container>
  );
}
