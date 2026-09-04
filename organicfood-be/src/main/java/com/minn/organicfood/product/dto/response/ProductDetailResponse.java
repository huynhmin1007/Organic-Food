package com.minn.organicfood.product.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Getter
@Setter
public class ProductDetailResponse {

    private UUID id;
    private String name;
    private String slug;
    private String sku;
    private Integer packQuantity;
    private String packUnit;
    private String packDetail;
    private BigDecimal price;
    private Integer stockQuantity;
    private String shortDescription;
    private String featureSpecification;
    private String productArticle;
    private List<String> images;

    private CategoryResponse category;
    private BrandResponse brand;

    List<ProductDiscountResponse> discounts;
}
