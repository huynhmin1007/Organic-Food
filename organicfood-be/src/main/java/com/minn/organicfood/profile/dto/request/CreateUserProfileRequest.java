package com.minn.organicfood.profile.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CreateUserProfileRequest {
    private UUID accountId;
    private String email;
    private String fullName;
    private String phone;
}
