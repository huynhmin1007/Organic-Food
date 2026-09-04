package com.minn.organicfood.identity.event;

import java.util.UUID;

public record AccountRegisteredEvent(
        UUID accountId,
        String email,
        String fullName,
        String phone
) {
}
