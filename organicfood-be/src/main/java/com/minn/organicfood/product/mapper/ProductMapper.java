package com.minn.organicfood.product.mapper;

import com.minn.organicfood.product.domain.Product;
import com.minn.organicfood.product.domain.ProductDiscount;
import com.minn.organicfood.product.dto.projection.ProductDetailCoreProjection;
import com.minn.organicfood.product.dto.response.*;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductDiscountResponse toDiscountResponse(ProductDiscount productDiscount);

    List<ProductDiscountResponse> toDiscountResponse(List<ProductDiscount> productDiscounts);

    default ProductResponse toListItemResponse(Product product, List<ProductDiscount> discounts) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .sku(product.getSku())
                .categoryId(product.getCategoryId())
                .brandId(product.getBrandId())
                .packQuantity(product.getPackQuantity())
                .packUnit(product.getPackUnit())
                .packDetail(product.getPackDetail())
                .price(product.getPrice())
                .thumbnailUrl(product.getThumbnailUrl())
                .stockQuantity(product.getStockQuantity())
                .discounts(toDiscountResponse(discounts))
                .build();
    }

    default ProductDetailResponse toDetailResponse(
            ProductDetailCoreProjection core,
            List<String> galleryImages,
            List<ProductDiscount> discounts
    ) {
        if(core.thumbnailUrl() != null) {
            galleryImages.set(0, core.thumbnailUrl());
        }
        ProductDetailResponse response = new ProductDetailResponse();
        response.setId(core.id());
        response.setName(core.name());
        response.setSlug(core.slug());
        response.setSku(core.sku());
        response.setPackQuantity(core.packQuantity());
        response.setPackUnit(core.packUnit());
        response.setPackDetail(core.packDetail());
        response.setPrice(core.price());
        response.setStockQuantity(core.stockQuantity());
        response.setShortDescription(core.shortDescription());
        response.setFeatureSpecification(core.featureSpecification());
        response.setProductArticle(core.productArticle());
        response.setImages(galleryImages);
        response.setCategory(new CategoryResponse(core.categoryId(), core.categoryName(), core.categorySlug(), core.categoryImg()));
        response.setBrand(new BrandResponse(core.brandId(), core.brandName(), core.brandSlug(), core.brandImg()));
        response.setDiscounts(toDiscountResponse(discounts));
        return response;
    }
}
