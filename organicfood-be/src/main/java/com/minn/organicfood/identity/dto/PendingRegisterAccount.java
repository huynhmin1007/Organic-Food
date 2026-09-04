package com.minn.organicfood.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PendingRegisterAccount {

    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String otp;
    private int attempts;
    Instant expiredAt;
}
