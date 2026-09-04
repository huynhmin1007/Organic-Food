package com.minn.organicfood.identity.controller;

import com.minn.organicfood.identity.dto.request.RefreshTokenRequest;
import com.minn.organicfood.identity.dto.request.RegisterRequest;
import com.minn.organicfood.identity.dto.request.TokenExchangeRequest;
import com.minn.organicfood.identity.dto.request.VerifyOtpRequest;
import com.minn.organicfood.identity.dto.response.AuthenticationResponse;
import com.minn.organicfood.identity.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    @PostMapping("/register")
    public String register(@RequestBody @Valid RegisterRequest request) {
        authenticationService.register(request);
        return "OTP sent to your email, please check your inbox";
    }

    @PostMapping("/register/verify")
    public String verifyRegister(@RequestBody @Valid VerifyOtpRequest request) {
        authenticationService.verifyRegister(request);
        return "Account register successfully";
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody @Valid TokenExchangeRequest request) {
        log.info("Login request: {}", request);
        return authenticationService.exchangeToken(request);
    }

    @PostMapping("/token/refresh")
    public AuthenticationResponse refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        return authenticationService.refreshToken(request.getRefreshToken());
    }
}
