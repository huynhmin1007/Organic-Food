package com.minn.organicfood.cart.dto;

import jakarta.validation.constraints.Positive;

import java.util.Map;
import java.util.UUID;

public record UpdateCartRequest(
        Map<UUID, @Positive Integer> items
) {
}
