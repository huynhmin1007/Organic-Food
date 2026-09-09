package com.minn.organicfood.profile.listener;

import com.minn.organicfood.notification.listener.handler.NotificationEventHandler;
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
public class ProfileEventListener {

    private static final String CONSUMER = "profile-module";

    private final IdempotentEventGuard idempotentEventGuard;
    private final Map<EventType, ProfileEventHandler<?>> handlers;

    public ProfileEventListener(IdempotentEventGuard idempotentEventGuard,
                                     List<ProfileEventHandler<?>> allHandlers) {
        this.idempotentEventGuard = idempotentEventGuard;
        this.handlers = allHandlers.stream()
                .collect(Collectors.toUnmodifiableMap(
                        ProfileEventHandler::support, h -> h));
    }

    @ApplicationModuleListener
    public void on(EventEnvelope<?> envelope) {
        idempotentEventGuard.runOnce(envelope, CONSUMER, () -> {
            ProfileEventHandler<?> handler = handlers.get(envelope.eventType());
            if (handler == null) {
                return;
            }
            invoke(handler, envelope.payload());
        });
    }

    @SuppressWarnings("unchecked")
    private <T> void invoke(ProfileEventHandler<T> handler, Object payload) {
        T typed = ((Class<T>) handler.payloadType()).cast(payload);
        handler.handle(typed);
    }
}

