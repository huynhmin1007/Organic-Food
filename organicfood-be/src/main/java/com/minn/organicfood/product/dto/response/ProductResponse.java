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
public class ProductResponse {

    private UUID id;
    private String name;
    private String slug;
    private String sku;
    private Long categoryId;
    private Long brandId;
    private Integer packQuantity;
    private String packUnit;
    private String packDetail;
    private BigDecimal price;
    private String thumbnailUrl;
    private Integer stockQuantity;
    List<ProductDiscountResponse> discounts;
}
