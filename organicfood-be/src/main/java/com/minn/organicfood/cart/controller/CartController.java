package com.minn.organicfood.cart.controller;

import com.minn.organicfood.cart.dto.CartItemResponse;
import com.minn.organicfood.cart.dto.CartResponse;
import com.minn.organicfood.cart.dto.UpdateCartRequest;
import com.minn.organicfood.cart.service.CartService;
import com.minn.organicfood.shared.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping()
    public void updateCart(@RequestBody @Valid UpdateCartRequest request) {
        UUID accountId = UUID.fromString(SecurityUtils.getCurrentUserId());
        cartService.updateCart(accountId, request);
    }

    @GetMapping()
    public CartResponse getCart() {
        UUID accountId = UUID.fromString(SecurityUtils.getCurrentUserId());
        return cartService.getCart(accountId);
    }
}
