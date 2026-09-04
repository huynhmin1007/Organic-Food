import { useParams } from "react-router-dom";
import Container from "../components/ui/Container";
import { useProduct } from "../hooks/useProduct";
import { getDiscountDisplay, getPricePerKgText } from "../lib/discount";
import ImageGallery from "../components/ui/ImageGallery";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import ProductCarousel from "../features/product/ProductCarousel";
import ExpandableContent from "../components/ui/ExpandableContent";
import { useCart } from "../contexts/CartContext";
import Toast from "../components/ui/Toast";

export default function ProductDetailPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { product, loading } = useProduct({ slug: productSlug });
  const { category } = useParams<{ category: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);

  if (loading || product === null) return <div></div>;

  const discountInfo = getDiscountDisplay(product);
  const pricePerKgText = getPricePerKgText(
    product.category.id,
    product.packDetail,
    discountInfo.sellingPrice,
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
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        categorySlug: category,
        thumbnailUrl: product.images[0] ?? "",
        unitPrice: discountInfo.sellingPrice,
        packDetail: product.packDetail,
      },
      quantity,
    );
    setShowToast(true);
  };

  const specRows = parseFeatureSpecification(product.featureSpecification);

  return (
    <Container>
      {showToast && (
        <Toast
          message={`Đã thêm ${quantity} "${product.name}" vào giỏ hàng`}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
        <div className="min-w-0 space-y-5">
          <ImageGallery images={product.images} alt={product.name} />

          {category && (
            <div className="bg-white rounded-lg shadow-sm px-2 py-3 flex flex-col">
              <h2 className="font-bold text-lg border-b border-neutral-200 pb-2">
                Sản phẩm liên quan
              </h2>
              <ProductCarousel
                className="mt-3"
                classNameForCard="border border-neutral-200 rounded-md"
                filter={{
                  categorySlugs: [category],
                  size: 20,
                  includeDescendants: true,
                }}
                itemPerSlide={4}
                excludeProduct={product.id}
              />
            </div>
          )}

          {(product.shortDescription ||
            specRows.length > 0 ||
            product.productArticle) && (
            <div className="bg-white rounded-lg shadow-sm px-2 py-3 flex flex-col">
              <h2 className="font-bold text-lg border-b border-neutral-200 pb-2">
                Thông tin sản phẩm
              </h2>

              {product.shortDescription && (
                <div
                  className="mt-3 text-sm text-neutral-700 leading-relaxed
                   [&_a]:text-primary-500 [&_a]:underline [&_a]:hover:text-primary-600"
                  dangerouslySetInnerHTML={{
                    __html: product.shortDescription,
                  }}
                />
              )}

              {specRows.length > 0 && (
                <div className="mt-4 mb-4">
                  <h3 className="font-semibold text-base mb-2">
                    Thông số kỹ thuật
                  </h3>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      {specRows.map((row, idx) => (
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
                <ExpandableContent collapsedHeight={250}>
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
                </ExpandableContent>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm px-2 py-3">
          <h1 className="text-lg font-semibold">{product.name}</h1>

          <div className="flex items-baseline gap-2 mt-4 flex-wrap">
            <p className="text-red-600 font-bold text-lg">
              {discountInfo.sellingPrice.toLocaleString("vi-VN")}đ
            </p>
            {discountInfo.originalPrice && (
              <p className="text-neutral-400 text-sm line-through">
                {discountInfo.originalPrice.toLocaleString("vi-VN")}đ
              </p>
            )}
            {discountInfo.cornerBadge && (
              <span className="bg-sale text-white text-xs font-bold px-1.5 py-0.5 rounded">
                {discountInfo.cornerBadge}
              </span>
            )}
          </div>

          {pricePerKgText && (
            <p className="text-neutral-400 text-sm mt-1">{pricePerKgText}</p>
          )}

          {product.packQuantity && product.packUnit && (
            <p className="text-neutral-500 text-sm mt-1">
              {product.packQuantity} {product.packUnit}
            </p>
          )}

          <div className="mt-10">
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
                    className="p-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50"
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
                    className="p-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50"
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

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="w-full mt-5 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300
                       disabled:cursor-not-allowed text-white font-bold text-base py-3 rounded-md
                       transition-colors"
          >
            {outOfStock ? "Tạm hết hàng" : "Thêm vào giỏ hàng"}
          </button>

          {discountInfo.belowPriceText && (
            <div className="mt-5 border border-amber-400 rounded-md overflow-hidden">
              <div className="bg-amber-50 px-3 py-2 text-amber-700 text-sm font-semibold flex items-center gap-1">
                🔥 ƯU ĐÃI ĐẶC BIỆT
              </div>
              <div className="px-3 py-2 flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">
                  {discountInfo.belowPriceText.toUpperCase()}
                </span>
                {discountInfo.belowPriceBadge && (
                  <span className="bg-sale text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {discountInfo.belowPriceBadge}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

type SpecRow = { label: string; value: string };

function parseFeatureSpecification(raw: string | null | undefined): SpecRow[] {
  if (!raw) return [];

  return raw
    .split(/<br\s*\/?>/i)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return { label: line, value: "" };

      return {
        label: line.slice(0, colonIndex).trim(),
        value: line.slice(colonIndex + 1).trim(),
      };
    });
}
