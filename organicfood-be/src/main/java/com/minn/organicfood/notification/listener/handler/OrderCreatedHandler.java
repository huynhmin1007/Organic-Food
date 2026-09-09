package com.minn.organicfood.notification.listener.handler;

import com.minn.organicfood.notification.domain.enums.NotificationChannel;
import com.minn.organicfood.notification.domain.enums.NotificationCode;
import com.minn.organicfood.notification.dto.request.NotificationRequest;
import com.minn.organicfood.notification.service.NotificationService;
import com.minn.organicfood.ordering.event.OrderCreatedEvent;
import com.minn.organicfood.shared.event.EventType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class OrderCreatedHandler implements NotificationEventHandler<OrderCreatedEvent> {

    private final NotificationService notificationService;

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
//        notificationService.send(NotificationRequest.builder()
//                .channel(NotificationChannel.EMAIL)
//                .recipient(payload.email())
//                .templateCode(NotificationCode.OTP_REGISTER)
//                .variables(Map.of(
//                        "fullName", payload.fullName(),
//                        "otp", payload.otp(),
//                        "expiredAt", String.valueOf(payload.otpExpirySeconds())))
//                .build());
    }
}
