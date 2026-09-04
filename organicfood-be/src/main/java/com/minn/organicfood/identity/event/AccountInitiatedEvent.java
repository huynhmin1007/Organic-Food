package com.minn.organicfood.identity.event;

public record AccountInitiatedEvent(
        String email,
        String fullName,
        String otp,
        int otpExpirySeconds
) {
}
