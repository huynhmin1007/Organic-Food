package com.minn.organicfood.notification.infra;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app.brevo")
@Setter
@Getter
public class BrevoProperties {
    private String apiKey;
    private String baseUrl;
    private String senderName;
    private String senderEmail;
}
