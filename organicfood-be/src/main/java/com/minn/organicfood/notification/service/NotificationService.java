package com.minn.organicfood.notification.service;

import com.minn.organicfood.notification.domain.NotificationLog;
import com.minn.organicfood.notification.domain.NotificationTemplate;
import com.minn.organicfood.notification.domain.enums.NotificationStatus;
import com.minn.organicfood.notification.dto.request.NotificationRequest;
import com.minn.organicfood.notification.infra.BrevoSender;
import com.minn.organicfood.notification.repository.NotificationTemplateRepository;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
@Slf4j
public class NotificationService {

    BrevoSender sender;
    NotificationTemplateRepository templateRepository;
    NotificationLogService logService;

    public void send(NotificationRequest request) {
        NotificationTemplate template = templateRepository
                .findByCode(request.getTemplateCode())
                .orElseThrow(() -> BusinessException.of(ErrorCode.NOTIFICATION_TEMPLATE_NOT_FOUND)
                        .withDetail("Template code: " + request.getTemplateCode())
                        .withContext("template_code", request.getTemplateCode()));

        validateVariables(template, request.getVariables());

        String renderedBody = render(template.getBody(), request.getVariables());
        String renderedSubject = render(template.getSubject(), request.getVariables());

        NotificationLog notificationLog = logService.savePending(request, renderedSubject, renderedBody);

        try {
            sender.send(request.getRecipient(), renderedSubject, renderedBody);
            logService.updateStatus(notificationLog, NotificationStatus.SENT, null);

        } catch (Exception e) {
            logService.updateStatus(notificationLog, NotificationStatus.FAILED, e.getMessage());
            log.error("Failed to send email to {}", request.getRecipient(), e);
            throw BusinessException.of(ErrorCode.NOTIFICATION_SEND_FAILED)
                    .withContext("error", e.getMessage());
        }
    }

    private void validateVariables(NotificationTemplate template, Map<String, String> variables) {
        List<String> missing = template.getVariables().stream()
                .filter(v -> !variables.containsKey(v))
                .toList();

        if (!missing.isEmpty())
            throw BusinessException.of(ErrorCode.INVALID_REQUEST)
                    .withDetail("Missing variables: " + String.join(", ", missing));
    }

    private String render(String template, Map<String, String> variables) {
        String result = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }
}
