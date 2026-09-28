package com.minn.organicfood.cart.service;

import com.minn.organicfood.cart.domain.Cart;
import com.minn.organicfood.cart.dto.CartItemResponse;
import com.minn.organicfood.cart.dto.CartResponse;
import com.minn.organicfood.cart.dto.UpdateCartRequest;
import com.minn.organicfood.product.domain.Product;
import com.minn.organicfood.product.dto.response.DiscountLineResult;
import com.minn.organicfood.product.mapper.ProductMapper;
import com.minn.organicfood.product.service.DiscountCalculator;
import com.minn.organicfood.product.service.ProductService;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import com.minn.organicfood.shared.infra.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CartService {

    private final ProductMapper productMapper;
    private final DiscountCalculator discountCalculator;
    private final ProductService productService;
    private final RedisService redisService;

    public void updateCart(UUID accountId, UpdateCartRequest request) {
        Map<UUID, Integer> items = request.items();
        if (items == null)
            return;

        if (!productService.isExists(items.keySet())) {
            throw BusinessException.of(ErrorCode.PRODUCT_NOT_FOUND);
        }

        String key = "account:" + accountId + ":cart";
        Cart cart = Cart.builder().items(request.items()).build();

        redisService.set(
                key,
                cart,
                365,
                TimeUnit.DAYS
        );
    }

    public CartResponse getCart(UUID accountId) {
        Cart cart = redisService.get(
                "account:" + accountId + ":cart",
                Cart.class
        );

        if (cart == null) {
            return CartResponse.empty();
        }

        Map<UUID, Integer> items = cart.getItems();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;

        List<Product> products =
                productService.findAllByIds(items.keySet());

        for (Product product : products) {
            DiscountLineResult discount = discountCalculator.pickBestLine(product, items.get(product.getId()));
            totalAmount = totalAmount.add(discount.lineTotal());
            discountAmount = discountAmount.add(benefit(discount));
        }

        List<CartItemResponse> cartItems = productService.enrichWithDiscounts(products).stream()
                .map(product -> new CartItemResponse(product, items.get(product.getId())))
                .toList();

        return CartResponse.builder()
                .totalQuantity(items.values().stream().mapToInt(Integer::intValue).sum())
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .items(cartItems)
                .build();
    }

    private BigDecimal benefit(DiscountLineResult result) {
        BigDecimal totalUnitsReceived = BigDecimal.valueOf(result.quantity() + result.freeQuantity());
        BigDecimal valueReceived = result.originalPrice().multiply(totalUnitsReceived);
        return valueReceived.subtract(result.lineTotal());
    }
}
