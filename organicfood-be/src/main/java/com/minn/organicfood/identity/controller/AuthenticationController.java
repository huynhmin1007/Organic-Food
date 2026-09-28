package com.minn.organicfood.identity.controller;

import com.minn.organicfood.identity.dto.request.*;
import com.minn.organicfood.identity.dto.response.AuthenticationResponse;
import com.minn.organicfood.identity.service.AuthenticationService;
import com.minn.organicfood.shared.config.CookieProperties;
import com.minn.organicfood.shared.exception.BaseErrorCode;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;
    CookieProperties cookieProperties;

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

    @PostMapping("/register/resend-otp")
    public String register(@RequestBody @Valid ResendOtpRequest request) {
        log.info("Resend OTP request: {}", request);
        authenticationService.resendOtp(request.getEmail());
        return "OTP sent to your email, please check your inbox";
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody @Valid TokenExchangeRequest request,
            HttpServletResponse response) {

        AuthenticationResponse authResponse = authenticationService.exchangeToken(request);
        ResponseCookie cookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(cookieProperties.isSecure())
                .sameSite("Strict")
                .path("/organicfood/api/v1/auth")
                .maxAge(authResponse.getRefreshExpiresIn())
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(authResponse.getAccessToken())
                .expiresIn(authResponse.getExpiresIn())
                .build());
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken == null) {
            throw BusinessException.of(ErrorCode.UNAUTHORIZED)
                    .withDetail("Missing refresh token");
        }

        AuthenticationResponse authResponse = authenticationService.refreshToken(refreshToken);

        // Rotation
        ResponseCookie cookie = ResponseCookie.from("refreshToken", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(cookieProperties.isSecure())
                .sameSite("Strict")
                .path("/organicfood/api/v1/auth")
                .maxAge(authResponse.getRefreshExpiresIn())
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(AuthenticationResponse.builder()
                .accessToken(authResponse.getAccessToken())
                .expiresIn(authResponse.getExpiresIn())
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(cookieProperties.isSecure())
                .sameSite("Strict")
                .path("/organicfood/api/v1/auth")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.noContent().build();
    }
}
