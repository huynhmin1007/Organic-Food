import { useLoaderData } from "react-router-dom";
import Container from "../components/ui/Container";
import type { ProductDetail } from "../types/product";
import { useProducts } from "../hooks/useProducts";
import { findCategoryPathBySlug } from "../lib/category";
import { useCategoryContext } from "../context/CategoryContext";
import ProductImageGallery from "../components/ProductImageGallery";
import Section from "../components/ui/Section";
import ProductCarouselV2 from "../components/ProductCarouselV2";
import Button from "../components/ui/Button";
import { ChevronRight, Minus, Plus } from "lucide-react";
import clsx from "clsx";
import ExpandableSection from "../components/ui/ExpandableSection";
import { useState } from "react";
import SaleBadge from "../components/SaleBadge";
import { getDiscountDisplay } from "../lib/discount";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage() {
  const { addItem } = useCart();
  const { categories } = useCategoryContext();
  const product = useLoaderData() as ProductDetail;
  const productInfo = getDiscountDisplay({
    categoryId: product.category.id,
    packDetail: product.packDetail,
    price: product.price,
    discount: product.discounts?.[0],
  });
  const [quantity, setQuantity] = useState(1);
  const packDiscounts =
    product.discounts?.filter((d) => d.discountType !== "PERCENTAGE") ?? [];

  const categoryPath = findCategoryPathBySlug(
    categories,
    product.category.slug,
  );
  const parentCategory = categoryPath.at(-1);

  const { products: relativeProducts, isLoading: isProductsLoading } =
    useProducts(
      parentCategory
        ? {
            categorySlugs: [parentCategory.slug],
            includeDescendants: true,
            size: 12,
          }
        : { productIds: [] },
    );

  const maxQuantity = product.stockQuantity;
  const outOfStock = maxQuantity <= 0;

  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () =>
    setQuantity((q) => Math.min(maxQuantity, q + 1));

  const handleQuantityInput = (value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      setQuantity(1);
      return;
    }
    setQuantity(Math.min(maxQuantity, Math.max(1, parsed)));
  };

  const handleAddToCart = () => {
    addItem(product.id, quantity);
  };

  return (
    <Container className="grid grid-cols-[1fr_360px] gap-5">
      <div className="min-w-0 space-y-5">
        <ProductImageGallery images={product.images.slice(1)} />
        <Section>
          <h2 className="font-bold text-lg border-b border-stone-200 pb-3 mb-3 cursor-pointer">
            Sản phẩm liên quan
          </h2>
          <ProductCarouselV2 itemsPerView={4} products={relativeProducts} />
          <div className="w-full flex items-center justify-center mt-4">
            <Button
              to={`/products?categorySlug=${parentCategory?.slug}`}
              variant={"outline"}
            >
              Xem thêm
              <ChevronRight size={16} />
            </Button>
          </div>
        </Section>

        {(product.shortDescription ||
          product.featureSpecification ||
          product.productArticle) && (
          <Section>
            <h2 className="font-bold text-lg border-b border-stone-200 pb-3 mb-3 cursor-pointer">
              Thông tin sản phẩm
            </h2>
            <ExpandableSection collapsedHeight={500}>
              <div className="space-y-3">
                {product.shortDescription && (
                  <div
                    className="text-sm text-neutral-700 leading-relaxed
                   [&_a]:text-primary-500 [&_a]:underline [&_a]:hover:text-primary-600"
                    dangerouslySetInnerHTML={{
                      __html: product.shortDescription,
                    }}
                  />
                )}
                {product.featureSpecification && (
                  <div>
                    <h3 className="font-medium text-base mb-2">
                      Thông số kỹ thuật
                    </h3>
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        {parseFeatureSpecification(
                          product.featureSpecification,
                        ).map((row, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-neutral-50" : "bg-white"
                            }
                          >
                            <td className="py-2 px-3 text-neutral-500 w-1/3 align-top">
                              {row.label}
                            </td>
                            <td className="py-2 px-3 text-neutral-800 font-medium">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {product.productArticle && (
                  <div
                    className="text-sm text-neutral-700 leading-relaxed
                 [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-4 [&_h3]:mb-2
                 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                 [&_a]:text-primary-500 [&_a]:underline [&_a]:hover:text-primary-600
                 [&_img]:w-full [&_img]:rounded-md [&_img]:my-3
                 [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: product.productArticle,
                    }}
                  />
                )}
              </div>
            </ExpandableSection>
          </Section>
        )}
      </div>
      <div className="bg-white rounded-md px-2 py-3">
        <h1 className="text-lg font-semibold">{product.name}</h1>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-red-600 font-bold text-lg">
              {productInfo.sellingPrice.toLocaleString("vi-VN")}đ
            </p>
            {productInfo.originalPrice && (
              <p className="text-neutral-400 text-sm line-through">
                {productInfo.originalPrice.toLocaleString("vi-VN")}đ
              </p>
            )}
          </div>
          {productInfo.cornerBadge && (
            <span className="bg-sale text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {productInfo.cornerBadge}
            </span>
          )}
        </div>

        {productInfo.pricePerKgText && (
          <p className="text-neutral-400 text-sm mt-1">
            {productInfo.pricePerKgText}
          </p>
        )}

        {product.packQuantity && product.packUnit && (
          <p className="text-neutral-500 text-sm mt-1">
            {product.packQuantity} {product.packUnit}
          </p>
        )}

        <div className="mt-5">
          <p className="text-base mb-2">Số lượng:</p>

          {outOfStock ? (
            <p className="text-red-500">Tạm hết hàng</p>
          ) : (
            <div className="flex gap-3 items-center">
              <div className="flex items-center border rounded-md border-neutral-300">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="cursor-pointer p-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50"
                  aria-label="Giảm số lượng"
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityInput(e.target.value)}
                  className="w-12 text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= maxQuantity}
                  className="cursor-pointer p-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50"
                  aria-label="Tăng số lượng"
                >
                  <Plus size={16} />
                </button>
              </div>

              <span className="text-sm text-neutral-500">
                {maxQuantity} sản phẩm có sẵn
              </span>
            </div>
          )}
        </div>

        <Button
          variant={"primary"}
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="mt-5 w-full"
        >
          {outOfStock ? "Tạm hết hàng" : "Thêm vào giỏ hàng"}
        </Button>

        {packDiscounts.length > 0 && (
          <div className="mt-5 border border-amber-400 rounded-md overflow-hidden">
            <div className="bg-amber-50 px-3 py-2 text-amber-700 text-sm font-semibold flex items-center gap-1">
              🔥 ƯU ĐÃI ĐẶC BIỆT
            </div>
            <div className="px-3 py-3 flex flex-col space-y-2">
              {product.discounts.map((discount) => {
                const info = getDiscountDisplay({
                  categoryId: product.category.id,
                  packDetail: product.packDetail,
                  price: product.price,
                  discount: discount,
                });

                return (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-orange-400 text-sm font-medium">
                      {info.belowPriceText}
                    </span>
                    {info.belowPriceBadge && (
                      <SaleBadge text={info.belowPriceBadge} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

interface FeatureSpecRow {
  label: string;
  value: string;
}

function parseFeatureSpecification(raw: string): FeatureSpecRow[] {
  return raw
    .split(/<br\s*\/?>/i) // tách theo <br /> hoặc <br>, không phân biệt hoa/thường
    .map((line) => line.replace(/\r?\n/g, "").trim()) // dọn ký tự xuống dòng thừa
    .filter((line) => line.length > 0)
    .map((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return { label: line, value: "" };
      return {
        label: line.slice(0, colonIndex).trim(),
        value: line.slice(colonIndex + 1).trim(),
      };
    });
}
