package com.minn.organicfood.cart.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CartResponse {
    private int totalQuantity;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private List<CartItemResponse> items;

    public static CartResponse empty() {
        return new CartResponse(0, BigDecimal.ZERO, BigDecimal.ZERO, List.of());
    }
}
