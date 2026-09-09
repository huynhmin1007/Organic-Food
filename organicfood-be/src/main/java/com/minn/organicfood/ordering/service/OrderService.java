package com.minn.organicfood.ordering.service;

import com.github.f4b6a3.uuid.UuidCreator;
import com.minn.organicfood.ordering.domain.Order;
import com.minn.organicfood.ordering.domain.OrderItem;
import com.minn.organicfood.ordering.domain.enums.OrderStatus;
import com.minn.organicfood.ordering.dto.request.OrderLineRequest;
import com.minn.organicfood.ordering.dto.request.PlaceOrderRequest;
import com.minn.organicfood.ordering.dto.response.OrderResponse;
import com.minn.organicfood.ordering.event.OrderCreatedEvent;
import com.minn.organicfood.ordering.mapper.OrderMapper;
import com.minn.organicfood.ordering.repository.OrderItemRepository;
import com.minn.organicfood.ordering.repository.OrderRepository;
import com.minn.organicfood.product.domain.Product;
import com.minn.organicfood.product.dto.response.DiscountLineResult;
import com.minn.organicfood.product.service.DiscountCalculator;
import com.minn.organicfood.product.service.ProductService;
import com.minn.organicfood.shared.event.EventEnvelope;
import com.minn.organicfood.shared.event.EventType;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository itemRepository;

    private final ApplicationEventPublisher publisher;

    private final DiscountCalculator discountCalculator;
    private final ProductService productService;

    private final OrderMapper mapper;

    @Transactional
    public OrderResponse placeOrder(UUID customerId, PlaceOrderRequest request) {
        Order existing = orderRepository.findByIdempotencyKey(request.getIdempotencyKey()).orElse(null);
        if (existing != null) {
            return mapper.toResponse(existing);
        }

        Set<OrderItem> items = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;

        for (OrderLineRequest line : request.getItems()) {
            UUID productId = line.getProductId();
            int quantity = line.getQuantity();
            Product product = productService.getAndLockProduct(productId);

            DiscountLineResult discount = discountCalculator.pickBestLine(product, quantity);

            int totalUnitsNeeded = discount.quantity() + discount.freeQuantity();
            if (product.getStockQuantity() < totalUnitsNeeded) {
                throw BusinessException.of(ErrorCode.INSUFFICIENT_STOCK);
            }

            items.add(OrderItem.builder()
                    .productId(productId)
                    .productName(product.getName())
                    .productSku(product.getSku())
                    .productImageUrl(product.getThumbnailUrl())
                    .discountId(discount.discountId())
                    .discountType(discount.discountType())
                    .discountLabel(discount.discountLabel())
                    .quantity(quantity)
                    .originalPrice(discount.originalPrice())
                    .unitPrice(discount.unitPrice())
                    .freeQuantity(discount.freeQuantity())
                    .lineTotal(discount.lineTotal())
                    .build());

            totalAmount = totalAmount.add(discount.lineTotal());
            discountAmount = discountAmount.add(benefit(discount));

            productService.decrementStock(product.getId(), totalUnitsNeeded);
        }

        Order order = Order.builder()
                .customerId(customerId)
                .idempotencyKey(request.getIdempotencyKey())
                .code(generateCode())
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .items(items)
                .build();

        for (OrderItem item : items) {
            item.setOrder(order);
        }

        orderRepository.save(order);

        publisher.publishEvent(EventEnvelope.of(
                EventType.ORDER_CREATED,
                order.getId().toString(),
                "ordering",
                OrderCreatedEvent.builder()
                        .accountId(order.getCustomerId())
                        .orderId(order.getId())
                        .status(order.getStatus())
                        .orderCode(order.getCode())
                        .phone(request.getPhone())
                        .address(request.getAddress())
                        .build()
        ));

        return mapper.toResponse(order);
    }

    public List<OrderResponse> getOrders(UUID accountId) {
        List<Order> orders = orderRepository.findByCustomerId(accountId);
        return orders.stream().map(mapper::toResponse).toList();
    }

    private BigDecimal benefit(DiscountLineResult result) {
        BigDecimal totalUnitsReceived = BigDecimal.valueOf(result.quantity() + result.freeQuantity());
        BigDecimal valueReceived = result.originalPrice().multiply(totalUnitsReceived);
        return valueReceived.subtract(result.lineTotal());
    }

    private static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private String generateCode() {
        String timestamp = LocalDateTime.now().format(FORMAT);
        int suffix = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "ORD" + timestamp + "-" + suffix;
    }
}
