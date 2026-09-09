package com.minn.organicfood.ordering.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.minn.organicfood.product.domain.enums.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderItemResponse {
    private UUID productId;
    private String productName;
    private String productSku;
    private String productImageUrl;
    private String discountLabel;
    private DiscountType discountType;
    private Integer quantity;
    private BigDecimal originalPrice;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
}
