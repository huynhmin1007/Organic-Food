package com.minn.organicfood.ordering.event;

import com.minn.organicfood.ordering.domain.enums.OrderStatus;
import lombok.Builder;

import java.util.UUID;

@Builder
public record OrderCreatedEvent(
        UUID accountId,
        UUID orderId,
        OrderStatus status,
        String orderCode,
        String phone,
        String address
) {
}
