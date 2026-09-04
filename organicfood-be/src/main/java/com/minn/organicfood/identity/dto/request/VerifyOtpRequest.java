package com.minn.organicfood.identity.dto.request;

import com.minn.organicfood.shared.validation.annotation.ValidEmail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class VerifyOtpRequest {

    @ValidEmail
    private String email;

    @Length(min = 6, max = 6, message = "OTP must be exactly 6 characters")
    private String otp;
}
