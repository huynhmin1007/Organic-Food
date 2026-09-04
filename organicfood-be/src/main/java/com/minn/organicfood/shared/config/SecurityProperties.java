package com.minn.organicfood.shared.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpMethod;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "app.security")
@Getter
@Setter
public class SecurityProperties {

    private List<PublicEndpoint> publicEndpoints = new ArrayList<>();

    public record PublicEndpoint(HttpMethod method, String pattern) {
        public PublicEndpoint {
            if (pattern == null || pattern.isBlank()) {
                throw new IllegalArgumentException("pattern must not be blank");
            }
        }
    }
}