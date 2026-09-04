package com.minn.organicfood.notification.listener;

import com.minn.organicfood.notification.listener.handler.NotificationEventHandler;
import com.minn.organicfood.shared.event.EventEnvelope;
import com.minn.organicfood.shared.event.EventType;
import com.minn.organicfood.shared.event.IdempotentEventGuard;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
public class NotificationEventListener {

    private static final String CONSUMER = "notification-module";

    private final IdempotentEventGuard idempotentEventGuard;
    private final Map<EventType, NotificationEventHandler<?>> handlers;

    public NotificationEventListener(IdempotentEventGuard idempotentEventGuard,
                                     List<NotificationEventHandler<?>> allHandlers) {
        this.idempotentEventGuard = idempotentEventGuard;
        this.handlers = allHandlers.stream()
                .collect(Collectors.toUnmodifiableMap(
                        NotificationEventHandler::support, h -> h));
    }

    @ApplicationModuleListener
    public void on(EventEnvelope<?> envelope) {
        idempotentEventGuard.runOnce(envelope, CONSUMER, () -> {
            NotificationEventHandler<?> handler = handlers.get(envelope.eventType());
            if (handler == null) {
                throw new IllegalStateException("No handler for " + envelope.eventType());
            }
            invoke(handler, envelope.payload());
        });
    }

    @SuppressWarnings("unchecked")
    private <T> void invoke(NotificationEventHandler<T> handler, Object payload) {
        T typed = ((Class<T>) handler.payloadType()).cast(payload);
        handler.handle(typed);
    }
}
