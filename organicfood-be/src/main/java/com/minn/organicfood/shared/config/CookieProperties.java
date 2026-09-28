package com.minn.organicfood.shared.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cookie")
@Getter
@Setter
public class CookieProperties {

    private boolean secure;
    private String sameSite;
}
