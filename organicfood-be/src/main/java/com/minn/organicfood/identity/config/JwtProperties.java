package com.minn.organicfood.identity.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        Duration accessValidity,
        Duration refreshValidity,
        String issuer
) {}
