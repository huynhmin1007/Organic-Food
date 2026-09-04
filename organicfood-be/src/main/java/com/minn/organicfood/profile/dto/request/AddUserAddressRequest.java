package com.minn.organicfood.profile.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class AddUserAddressRequest {

    @NotBlank(message = "Address is required")
    private String address;
    private Boolean isDefault = false;
}
