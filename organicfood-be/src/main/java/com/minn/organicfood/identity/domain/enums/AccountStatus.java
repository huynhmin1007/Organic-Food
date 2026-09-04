package com.minn.organicfood.identity.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum AccountStatus {
    ACTIVE,
    INACTIVE,
    BANNED,
}
