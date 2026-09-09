package com.minn.organicfood.shipping.listener;

import com.minn.organicfood.shared.event.EventEnvelope;
import com.minn.organicfood.shared.event.EventType;
import com.minn.organicfood.shared.event.IdempotentEventGuard;
import com.minn.organicfood.shipping.listener.handler.ShippingEventHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ShippingEventListener {

    private static final String CONSUMER = "shipping-module";

    private final IdempotentEventGuard idempotentEventGuard;
    private final Map<EventType, ShippingEventHandler<?>> handlers;

    public ShippingEventListener(IdempotentEventGuard idempotentEventGuard,
                                 List<ShippingEventHandler<?>> allHandlers) {
        this.idempotentEventGuard = idempotentEventGuard;
        this.handlers = allHandlers.stream()
                .collect(Collectors.toUnmodifiableMap(
                        ShippingEventHandler::support, h -> h));
    }

    @ApplicationModuleListener
    public void on(EventEnvelope<?> envelope) {
        idempotentEventGuard.runOnce(envelope, CONSUMER, () -> {
            ShippingEventHandler<?> handler = handlers.get(envelope.eventType());
            if (handler == null) {
                return;
            }
            invoke(handler, envelope.payload());
        });
    }

    @SuppressWarnings("unchecked")
    private <T> void invoke(ShippingEventHandler<T> handler, Object payload) {
        T typed = ((Class<T>) handler.payloadType()).cast(payload);
        handler.handle(typed);
    }
}
