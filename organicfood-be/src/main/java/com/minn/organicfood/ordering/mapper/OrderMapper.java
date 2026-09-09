package com.minn.organicfood.ordering.mapper;

import com.minn.organicfood.ordering.domain.Order;
import com.minn.organicfood.ordering.domain.OrderItem;
import com.minn.organicfood.ordering.dto.response.OrderItemResponse;
import com.minn.organicfood.ordering.dto.response.OrderResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderItemResponse toResponse(OrderItem item);
    List<OrderItemResponse> toResponse(List<OrderItem> items);
    OrderResponse toResponse(Order order);
}
