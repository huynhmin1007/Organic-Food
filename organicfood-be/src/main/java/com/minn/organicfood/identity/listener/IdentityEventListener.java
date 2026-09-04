package com.minn.organicfood.identity.listener;

import com.minn.organicfood.identity.listener.handler.IdentityEventHandler;
import com.minn.organicfood.profile.listener.handler.ProfileEventHandler;
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
public class IdentityEventListener {

    private static final String CONSUMER = "identity-module";

    private final IdempotentEventGuard idempotentEventGuard;
    private final Map<EventType, IdentityEventHandler<?>> handlers;

    public IdentityEventListener(IdempotentEventGuard idempotentEventGuard,
                                 List<IdentityEventHandler<?>> allHandlers) {
        this.idempotentEventGuard = idempotentEventGuard;
        this.handlers = allHandlers.stream()
                .collect(Collectors.toUnmodifiableMap(
                        IdentityEventHandler::support, h -> h));
    }

    @ApplicationModuleListener
    public void on(EventEnvelope<?> envelope) {
        idempotentEventGuard.runOnce(envelope, CONSUMER, () -> {
            IdentityEventHandler<?> handler = handlers.get(envelope.eventType());
            if (handler == null) {
                throw new IllegalStateException("No handler for " + envelope.eventType());
            }
            invoke(handler, envelope.payload());
        });
    }

    @SuppressWarnings("unchecked")
    private <T> void invoke(IdentityEventHandler<T> handler, Object payload) {
        T typed = ((Class<T>) handler.payloadType()).cast(payload);
        handler.handle(typed);
    }
}

