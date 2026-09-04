package com.minn.organicfood.shared.event;

public interface EventHandler<T> {
    EventType support();
    Class<T> payloadType();
    void handle(T payload);
}
