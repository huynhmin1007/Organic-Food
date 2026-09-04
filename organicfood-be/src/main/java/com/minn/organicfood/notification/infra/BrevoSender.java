package com.minn.organicfood.notification.infra;

import com.minn.organicfood.shared.exception.BusinessException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;


@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BrevoSender {

    BrevoProperties properties;
    RestClient brevoRestClient;

    public void send(String recipient, String subject, String htmlContent) {
        try {
            var request = BrevoSendMailRequest.builder()
                    .sender(new BrevoSendMailRequest.Sender(
                            properties.getSenderName(),
                            properties.getSenderEmail()
                    ))
                    .to(List.of(new BrevoSendMailRequest.Recipient(recipient)))
                    .subject(subject)
                    .htmlContent(htmlContent)
                    .build();

            brevoRestClient.post()
                    .uri("/smtp/email")
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();

            log.info("[Brevo] Sent email to {}", recipient);

        } catch (Exception e) {
            log.error("[Brevo] Failed to send email to {}", recipient, e);
            throw new RuntimeException(e);
        }
    }
}
