import Container from "../components/ui/Container";
import Section from "../components/ui/Section";
import banner from "../assets/section_hot_banner_2048x2048.webp";
import banner2 from "../assets/section_pro_banner.webp";
import ProductCarouselWithBanner from "../features/product/ProductCarouselWithBanner";
import NewsSection from "../features/news/NewSection";
import BannerSection from "../features/news/BannerSection";
import ProductCarousel from "../features/product/ProductCarousel";
import ProductGrid from "../features/product/ProductGrid";

export default function HomePage() {
  return (
    <Container className="space-y-8">
      <BannerSection />

      <Section title="Hôm Nay Ăn Gì?">
        <ProductCarousel
          filter={{
            size: 20,
            onSale: true,
            categorySlugs: ["rau-cu-trai-cay"],
            includeDescendants: true,
          }}
        />
      </Section>

      <Section title="Rau Củ Quả Organic">
        <ProductGrid
          filter={{
            categorySlugs: ["rau-cu-trai-cay"],
            includeDescendants: true,
          }}
          columns={5}
          count={10}
        />
      </Section>

      <div>
        <img
          src={banner}
          alt="Banner"
          className="w-full h-full cursor-pointer"
        />
      </div>

      <Section title="GÓI THÀNH VIÊN - TIẾT KIỆM 20%">
        <ProductCarouselWithBanner
          banner={banner2}
          viewAllHref="/collections/goi-thanh-vien"
        />
      </Section>

      <Section>
        <NewsSection viewAllHref="/blogs/news" />
      </Section>
    </Container>
  );
}
