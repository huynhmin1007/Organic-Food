package com.minn.organicfood.profile.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserInfo {

    UUID accountId;
    String email;
    String fullName;
    String phone;
    Set<UserAddressResponse> addresses;
}
