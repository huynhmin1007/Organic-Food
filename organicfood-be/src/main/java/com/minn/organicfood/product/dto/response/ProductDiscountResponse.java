package com.minn.organicfood.product.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductDiscountResponse(
        String discountType,
        String label,
        BigDecimal discountPercent,
        Long fixedPrice,
        Integer buyQuantity,
        Integer getQuantity,
        Instant endAt) {
}

