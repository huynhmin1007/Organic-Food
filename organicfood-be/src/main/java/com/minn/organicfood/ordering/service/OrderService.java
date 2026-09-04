package com.minn.organicfood.ordering.service;

import com.minn.organicfood.ordering.repository.OrderItemRepository;
import com.minn.organicfood.ordering.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository itemRepository;

    private final ApplicationEventPublisher publisher;

    public void placeOrder() {

    }
}
