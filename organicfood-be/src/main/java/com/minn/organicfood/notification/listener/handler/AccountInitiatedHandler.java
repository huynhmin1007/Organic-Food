package com.minn.organicfood.notification.listener.handler;

import com.minn.organicfood.identity.event.AccountInitiatedEvent;
import com.minn.organicfood.notification.domain.enums.NotificationChannel;
import com.minn.organicfood.notification.domain.enums.NotificationCode;
import com.minn.organicfood.notification.dto.request.NotificationRequest;
import com.minn.organicfood.notification.service.NotificationService;
import com.minn.organicfood.shared.event.EventType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AccountInitiatedHandler implements NotificationEventHandler<AccountInitiatedEvent> {
    NotificationService notificationService;

    @Override
    public EventType support() {
        return EventType.ACCOUNT_INITIATED;
    }

    @Override
    public Class<AccountInitiatedEvent> payloadType() {
        return AccountInitiatedEvent.class;
    }

    @Override
    public void handle(AccountInitiatedEvent payload) {
        notificationService.send(NotificationRequest.builder()
                .channel(NotificationChannel.EMAIL)
                .recipient(payload.email())
                .templateCode(NotificationCode.OTP_REGISTER)
                .variables(Map.of(
                        "fullName", payload.fullName(),
                        "otp", payload.otp(),
                        "expiredAt", String.valueOf(payload.otpExpirySeconds())))
                .build());
    }
}
