package com.minn.organicfood;

import com.minn.organicfood.notification.domain.NotificationTemplate;
import com.minn.organicfood.notification.domain.enums.NotificationChannel;
import com.minn.organicfood.notification.domain.enums.NotificationCode;
import com.minn.organicfood.notification.repository.NotificationTemplateRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NotificationDataInitializer {

    NotificationTemplateRepository templateRepository;

    public void init() {
        if (templateRepository.count() > 0) {
            log.info("[Notification] Templates already seeded, skipping...");
            return;
        }

        templateRepository.saveAll(List.of(
                buildTemplate(
                        NotificationCode.OTP_REGISTER,
                        "Mã xác thực đăng ký tài khoản OrganicFood",
                        "templates/otp-register.html",
                        List.of("fullName", "otp", "expiredAt")
                ),
                buildTemplate(
                        NotificationCode.WELCOME,
                        "Chào mừng bạn đến với OrganicFood 🌿",
                        "templates/welcome.html",
                        List.of("fullName")
                )
        ));

        log.info("[Notification] Done seeding templates.");
    }

    private NotificationTemplate buildTemplate(
            NotificationCode code,
            String subject,
            String templatePath,
            List<String> variables) {

        return NotificationTemplate.builder()
                .code(code)
                .channel(NotificationChannel.EMAIL)
                .subject(subject)
                .variables(variables)
                .body(loadTemplate(templatePath))
                .build();
    }

    private String loadTemplate(String path) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            return resource.getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot load template: " + path, e);
        }
    }
}
