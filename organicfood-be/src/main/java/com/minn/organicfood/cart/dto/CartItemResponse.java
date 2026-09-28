package com.minn.organicfood.cart.dto;

import com.minn.organicfood.product.dto.response.ProductResponse;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CartItemResponse {
    private ProductResponse product;
    private int quantity;
}
