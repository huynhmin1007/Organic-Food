package com.minn.organicfood.shipping.listener.handler;

import com.minn.organicfood.ordering.event.OrderCreatedEvent;
import com.minn.organicfood.shared.event.EventType;
import com.minn.organicfood.shipping.domain.Shipment;
import com.minn.organicfood.shipping.domain.enums.ShipmentStatus;
import com.minn.organicfood.shipping.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CreateShippingHandler implements ShippingEventHandler<OrderCreatedEvent> {

    private final ShipmentRepository shipmentRepository;

    @Override
    public EventType support() {
        return EventType.ORDER_CREATED;
    }

    @Override
    public Class<OrderCreatedEvent> payloadType() {
        return OrderCreatedEvent.class;
    }

    @Override
    public void handle(OrderCreatedEvent payload) {
        shipmentRepository.save(Shipment.builder()
                        .orderId(payload.orderId())
                        .status(ShipmentStatus.PENDING)
                        .carrier("Organic Foods")
                        .trackingCode("TRACK-" + payload.orderId())
                        .addressLine(payload.address())
                .build());
    }
}
