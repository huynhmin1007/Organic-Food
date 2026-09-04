package com.minn.organicfood.identity.dto.request;

import com.minn.organicfood.shared.validation.annotation.ValidEmail;
import com.minn.organicfood.shared.validation.annotation.ValidPassword;
import com.minn.organicfood.shared.validation.annotation.ValidPhone;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @ValidEmail
    private String email;

    @ValidPhone
    private String phone;

    @ValidPassword
    private String password;

    @Length(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
    private String fullName;
}
