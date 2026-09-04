package com.minn.organicfood.product.dto.projection;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductDetailCoreProjection(
        UUID id, String name, String slug, String sku,
        Integer packQuantity, String packUnit, String packDetail,
        BigDecimal price, Integer stockQuantity,
        String shortDescription, String featureSpecification, String productArticle,
        String thumbnailUrl,
        Long categoryId, String categoryName, String categorySlug, String categoryImg,
        Long brandId, String brandName, String brandSlug, String brandImg
) {
}

