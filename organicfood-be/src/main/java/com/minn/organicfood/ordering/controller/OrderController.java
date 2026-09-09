package com.minn.organicfood.ordering.controller;

import com.minn.organicfood.ordering.dto.request.PlaceOrderRequest;
import com.minn.organicfood.ordering.dto.response.OrderResponse;
import com.minn.organicfood.ordering.service.OrderService;
import com.minn.organicfood.shared.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.SystemUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place-order")
    public OrderResponse placeOrder(@RequestBody @Valid PlaceOrderRequest request) {
        return orderService.placeOrder(UUID.fromString(SecurityUtils.getCurrentUserId()), request);
    }

    @GetMapping()
    public List<OrderResponse> getOrders() {
        return orderService.getOrders(UUID.fromString(SecurityUtils.getCurrentUserId()));
    }
}
