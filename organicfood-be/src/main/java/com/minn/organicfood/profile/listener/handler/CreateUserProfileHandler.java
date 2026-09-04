package com.minn.organicfood.profile.listener.handler;

import com.minn.organicfood.identity.event.AccountRegisteredEvent;
import com.minn.organicfood.notification.domain.enums.NotificationChannel;
import com.minn.organicfood.notification.domain.enums.NotificationCode;
import com.minn.organicfood.notification.dto.request.NotificationRequest;
import com.minn.organicfood.notification.listener.handler.NotificationEventHandler;
import com.minn.organicfood.notification.service.NotificationService;
import com.minn.organicfood.profile.dto.request.CreateUserProfileRequest;
import com.minn.organicfood.profile.service.UserProfileService;
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
public class CreateUserProfileHandler implements ProfileEventHandler<AccountRegisteredEvent> {
    UserProfileService userProfileService;

    @Override
    public EventType support() {
        return EventType.ACCOUNT_VERIFIED;
    }

    @Override
    public Class<AccountRegisteredEvent> payloadType() {
        return AccountRegisteredEvent.class;
    }

    @Override
    public void handle(AccountRegisteredEvent payload) {
        userProfileService.createProfile(CreateUserProfileRequest.builder()
                        .email(payload.email())
                        .accountId(payload.accountId())
                        .fullName(payload.fullName())
                        .phone(payload.phone())
                .build());
    }
}
