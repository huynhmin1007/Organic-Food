package com.minn.organicfood.product.dto.response;

import com.minn.organicfood.product.domain.enums.DiscountType;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record DiscountLineResult(
        UUID productId,
        int quantity,
        UUID discountId,
        int freeQuantity,
        BigDecimal unitPrice,
        BigDecimal originalPrice,
        BigDecimal lineTotal,
        String discountLabel,
        DiscountType discountType
) {
    public static DiscountLineResult noDiscount(UUID productId, int quantity, BigDecimal price) {
        BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(quantity));
        return new DiscountLineResult(productId, quantity, null, 0, price, price, lineTotal, null, null);
    }
}
