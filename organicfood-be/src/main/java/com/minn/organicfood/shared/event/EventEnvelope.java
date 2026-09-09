package com.minn.organicfood.shared.event;

import          com.github.f4b6a3.uuid.UuidCreator;

import java.time.Instant;

public record EventEnvelope<T> (
        String eventId,
        EventType eventType,
        String correlationId,
        String producer,
        Instant occurredAt,
        T payload
) {
    public static <T> EventEnvelope<T> of(
            EventType eventType,
            String correlationId,
            String producer,
            T payload
    ) {
        return new EventEnvelope<>(
                UuidCreator.getTimeOrderedEpoch().toString(),
                eventType,
                correlationId,
                producer,
                Instant.now(),
                payload
        );
    }
}
