package com.minn.organicfood.identity.dto.request;

import com.minn.organicfood.shared.validation.annotation.ValidEmail;
import com.minn.organicfood.shared.validation.annotation.ValidPassword;
import lombok.*;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Setter
@Getter
public class TokenExchangeRequest {

    @ValidEmail
    private String email;

    @ValidPassword
    private String password;
}

