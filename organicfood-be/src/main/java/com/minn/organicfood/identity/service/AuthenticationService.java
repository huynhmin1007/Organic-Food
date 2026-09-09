package com.minn.organicfood.identity.service;

import com.minn.organicfood.identity.config.JwtProperties;
import com.minn.organicfood.identity.config.RsaKeyProperties;
import com.minn.organicfood.identity.domain.Account;
import com.minn.organicfood.identity.domain.enums.AccountStatus;
import com.minn.organicfood.identity.dto.PendingRegisterAccount;
import com.minn.organicfood.identity.dto.TokenPayload;
import com.minn.organicfood.identity.dto.request.RegisterRequest;
import com.minn.organicfood.identity.dto.request.TokenExchangeRequest;
import com.minn.organicfood.identity.dto.request.VerifyOtpRequest;
import com.minn.organicfood.identity.dto.response.AuthenticationResponse;
import com.minn.organicfood.identity.event.AccountInitiatedEvent;
import com.minn.organicfood.identity.event.AccountRegisteredEvent;
import com.minn.organicfood.identity.repository.AccountRepository;
import com.minn.organicfood.shared.event.EventEnvelope;
import com.minn.organicfood.shared.event.EventType;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.infra.RedisService;
import com.minn.organicfood.shared.utils.OtpUtils;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.minn.organicfood.shared.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
@Slf4j
public class AuthenticationService {

    RoleService roleService;
    PasswordEncoder passwordEncoder;
    AccountRepository accountRepository;
    RedisService redisService;
    JwtProperties jwtProperties;
    RsaKeyProperties rsaKeys;

    ApplicationEventPublisher publisher;

    final static String BLACKLIST_PREFIX = "blacklist:jti:";
    final static String BANNED_SESSION_PREFIX = "banned-session:";

    private static final long SESSION_TTL_SECONDS = 600; // phiên đăng ký sống 10 phút
    private static final long OTP_TTL_SECONDS = 60;       // mã OTP chỉ 60s

    @Transactional
    public void register(RegisterRequest request) {
        String email = request.getEmail();

        if (accountRepository.existsByEmail(email))
            throw BusinessException.of(EMAIL_ALREADY_IN_USE)
                    .withDetail("email=%s", email);

        request.setPassword(passwordEncoder.encode(request.getPassword()));

        String otp = OtpUtils.generateOtp();

        PendingRegisterAccount pendingInfo = PendingRegisterAccount.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .otp(otp)
                .expiredAt(Instant.now().plusSeconds(OTP_TTL_SECONDS))
                .build();

        redisService.set(
                buildKey(email, "register"),
                pendingInfo,
                SESSION_TTL_SECONDS,   // ← TTL của cả KEY (phiên), dài hơn
                TimeUnit.SECONDS
        );

        publisher.publishEvent(EventEnvelope.of(
                EventType.ACCOUNT_INITIATED,
                UUID.randomUUID().toString(),
                "identity",
                new AccountInitiatedEvent(email, request.getFullName(), otp, 60)
        ));
    }

    @Transactional
    public void verifyRegister(VerifyOtpRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();

        if (accountRepository.existsByEmail(email))
            throw BusinessException.of(EMAIL_ALREADY_IN_USE)
                    .withDetail("email=%s", email);

        PendingRegisterAccount pendingInfo = redisService.get(buildKey(email, "register"),
                PendingRegisterAccount.class);

        if (pendingInfo == null) {
            throw BusinessException.of(OTP_EXPIRED);
        }

        if (Instant.now().isAfter(pendingInfo.getExpiredAt())) {
            throw BusinessException.of(OTP_EXPIRED);
        }

        if (pendingInfo.getAttempts() >= 5) {
            redisService.delete(buildKey(email, "register"));
            throw BusinessException.of(OTP_ATTEMPTS_EXCEEDED)
                    .withDetail("max_attempts=%n", 5);
        }

        if (!pendingInfo.getOtp().equals(otp)) {
            pendingInfo.setAttempts(pendingInfo.getAttempts() + 1);
            long ttl = Duration.between(Instant.now(), pendingInfo.getExpiredAt()).toSeconds();
            redisService.set(buildKey(email, "register"), pendingInfo, ttl, TimeUnit.SECONDS);

            throw BusinessException.of(OTP_INVALID);
        }

        Account account = Account.builder()
                .email(pendingInfo.getEmail())
                .password(pendingInfo.getPassword())
                .status(AccountStatus.ACTIVE)
                .build();
        account.addRole(roleService.findByName("CUSTOMER"));

        accountRepository.save(account);

        redisService.delete(buildKey(email, "register"));

        publisher.publishEvent(EventEnvelope.of(
                EventType.ACCOUNT_VERIFIED,
                UUID.randomUUID().toString(),
                "identity",
                new AccountRegisteredEvent(account.getId(), email, pendingInfo.getFullName(), pendingInfo.getPhone())
        ));
    }

    public void resendOtp(String email) {
        PendingRegisterAccount pendingInfo = redisService.get(buildKey(email, "register"),
                PendingRegisterAccount.class);

        if(pendingInfo == null) {
            throw BusinessException.of(ACCOUNT_NOT_FOUND);
        }

        String otp = OtpUtils.generateOtp();
        pendingInfo.setOtp(otp);
        pendingInfo.setExpiredAt(Instant.now().plusSeconds(OTP_TTL_SECONDS));
        redisService.set(buildKey(email, "register"), pendingInfo, SESSION_TTL_SECONDS, TimeUnit.SECONDS);

        publisher.publishEvent(EventEnvelope.of(
                EventType.ACCOUNT_INITIATED,
                UUID.randomUUID().toString(),
                "identity",
                new AccountInitiatedEvent(email, pendingInfo.getFullName(), otp, 60)
        ));
    }

    public AuthenticationResponse exchangeToken(TokenExchangeRequest request) {
        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> BusinessException.of(ACCOUNT_NOT_FOUND)
                        .withDetail("email=%s", request.getEmail()));

        boolean isMatchingPassword = passwordEncoder.matches(request.getPassword(), account.getPassword());

        if (!isMatchingPassword) {
            throw BusinessException.of(INVALID_CREDENTIALS);
        }

        return AuthenticationResponse.builder()
                .accessToken(generateAccessToken(account))
                .refreshToken(generateRefreshToken(account))
                .expiresIn(jwtProperties.accessValidity().toSeconds())
                .refreshExpiresIn(jwtProperties.refreshValidity().toSeconds())
                .build();
    }

    public TokenPayload verifyAndExtract(String token, String expectedTokenType) {
        try {
            JWTClaimsSet claims = extractClaims(token);

            Date expiration = claims.getExpirationTime();
            if (expiration != null && expiration.before(new Date())) {
                throw BusinessException.of(TOKEN_EXPIRED);
            }

            String tokenType = claims.getStringClaim("tokenType");

            if (!expectedTokenType.equalsIgnoreCase(tokenType)) {
                throw BusinessException.of(INVALID_TOKEN);
            }

            boolean isBlacklisted = redisService.exists(BLACKLIST_PREFIX + claims.getJWTID());
            if (isBlacklisted) {
                throw BusinessException.of(TOKEN_REVOKED);
            }

            String accountId = claims.getSubject();
            Instant issueTime = claims.getIssueTime() != null ? claims.getIssueTime().toInstant() : null;
            String bannedEpochStr = redisService.get(BANNED_SESSION_PREFIX + accountId, String.class);

            if (bannedEpochStr != null && issueTime != null) {
                long bannedEpoch = Long.parseLong(bannedEpochStr);
                long tokenEpoch = issueTime.toEpochMilli();

                if (tokenEpoch <= bannedEpoch) {
                    throw BusinessException.of(TOKEN_REVOKED);
                }
            }

            String scopeStr = claims.getStringClaim("scope");
            List<String> authorityList = Collections.emptyList();
            if (StringUtils.hasText(scopeStr)) {
                authorityList = Arrays.asList(scopeStr.split(" "));
            }

            return TokenPayload.builder()
                    .accountId(accountId)
                    .authorities(authorityList)
                    .email(claims.getStringClaim("email"))
                    .build();
        } catch (ParseException e) {
            log.error("Failed to verify JWT token: {}", token, e);
            throw BusinessException.of(INVALID_TOKEN);
        }
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        try {
            JWTClaimsSet claims = extractClaims(refreshToken);

            if (!"refresh".equalsIgnoreCase(claims.getStringClaim("tokenType"))) {
                throw BusinessException.of(INVALID_TOKEN);
            }

            boolean isBlacklisted = redisService.exists(BLACKLIST_PREFIX + claims.getJWTID());
            if (isBlacklisted) {
                throw BusinessException.of(TOKEN_REVOKED);
            }

            String jti = claims.getJWTID();
            Date expirationTime = claims.getExpirationTime();

            long timeToLiveMillis = expirationTime.getTime() - System.currentTimeMillis();
            if (timeToLiveMillis > 0) {
                revokeToken(jti, timeToLiveMillis);
            }

            Account user = accountRepository.findById(UUID.fromString(claims.getSubject()))
                    .orElseThrow(() -> BusinessException.of(ACCOUNT_NOT_FOUND));

            return AuthenticationResponse.builder()
                    .accessToken(generateAccessToken(user))
                    .refreshToken(generateRefreshToken(user))
                    .expiresIn(jwtProperties.accessValidity().toSeconds())
                    .refreshExpiresIn(jwtProperties.refreshValidity().toSeconds())
                    .build();
        } catch (ParseException e) {
            log.error("Failed to refresh token: {}", refreshToken, e);
            throw BusinessException.of(INVALID_TOKEN);
        }
    }

    private void revokeToken(String token, long timeoutMillis) {
        redisService.set(BLACKLIST_PREFIX + token, "revoked", timeoutMillis, TimeUnit.MILLISECONDS);
    }

    private String generateAccessToken(Account account) {
        try {
            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                    .type(JOSEObjectType.JWT)
                    .build();

            Instant now = Instant.now();

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .issuer(jwtProperties.issuer())
                    .subject(account.getId().toString())
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plus(jwtProperties.accessValidity())))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("scope", buildScope(account))
                    .claim("email", account.getEmail())
                    .claim("tokenType", "access")
                    .build();

            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            signedJWT.sign(new RSASSASigner(rsaKeys.privateKey()));

            return signedJWT.serialize();
        } catch (JOSEException e) {
            log.error("Failed to sign JWT for account: {}", account.getEmail(), e);
            throw new RuntimeException("Internal error while generating token");
        }
    }

    private String generateRefreshToken(Account account) {
        try {
            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                    .type(JOSEObjectType.JWT)
                    .build();

            Instant now = Instant.now();

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .issuer(jwtProperties.issuer())
                    .subject(account.getId().toString())
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plus(jwtProperties.refreshValidity())))
                    .jwtID(UUID.randomUUID().toString())
                    .claim("email", account.getEmail())
                    .claim("tokenType", "refresh")
                    .build();

            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            signedJWT.sign(new RSASSASigner(rsaKeys.privateKey()));

            return signedJWT.serialize();
        } catch (JOSEException e) {
            log.error("Failed to sign JWT for account: {}", account.getEmail(), e);
            throw new RuntimeException("Internal error while generating token");
        }
    }

    private String buildScope(Account account) {
        Set<String> authorities = new HashSet<>();

        if (CollectionUtils.isEmpty(account.getRoles())) return "";

        account.getRoles().forEach(role -> {
            authorities.add("ROLE_" + role.getName().toUpperCase());

            if (!CollectionUtils.isEmpty(role.getPermissions())) {
                role.getPermissions().forEach(permission ->
                        authorities.add(permission.getName().toLowerCase())
                );
            }
        });

        return String.join(" ", authorities);
    }

    private JWTClaimsSet extractClaims(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RSASSAVerifier verifier = new RSASSAVerifier(rsaKeys.publicKey());
            if (!signedJWT.verify(verifier)) {
                throw BusinessException.of(INVALID_TOKEN);
            }

            if (claims.getExpirationTime() == null || new Date().after(claims.getExpirationTime())) {
                throw BusinessException.of(TOKEN_EXPIRED);
            }

            return claims;
        } catch (JOSEException | ParseException e) {
            log.error("Failed to parse or verify JWT token", e);
            throw BusinessException.of(INVALID_TOKEN);
        }
    }

    private String buildKey(String email, String type) {
        return String.format("%s:%s", type, email);
    }
}
