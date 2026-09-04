package com.minn.organicfood.notification.service;

import com.minn.organicfood.notification.domain.NotificationLog;
import com.minn.organicfood.notification.domain.enums.NotificationStatus;
import com.minn.organicfood.notification.dto.request.NotificationRequest;
import com.minn.organicfood.notification.repository.NotificationLogRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationLogService {

    NotificationLogRepository logRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public NotificationLog savePending(NotificationRequest request,
                                       String renderedSubject,
                                       String renderedBody) {
        NotificationLog log = NotificationLog.builder()
                .templateCode(request.getTemplateCode())
                .channel(request.getChannel())
                .recipient(request.getRecipient())
                .subject(renderedSubject)
                .body(renderedBody)
                .variables(request.getVariables())
                .status(NotificationStatus.PENDING)
                .build();
        return logRepository.save(log);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void updateStatus(NotificationLog notificationLog,
                             NotificationStatus status,
                             String errorMessage) {
        notificationLog.setStatus(status);
        notificationLog.setErrorMessage(errorMessage);
        if (status == NotificationStatus.SENT)
            notificationLog.setSentAt(Instant.now());
        logRepository.save(notificationLog);
    }
}
