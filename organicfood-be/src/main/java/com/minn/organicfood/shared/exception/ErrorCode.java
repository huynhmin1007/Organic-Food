package com.minn.organicfood.shared.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode implements BaseErrorCode{

    INTERNAL_ERROR(5000, "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_REQUEST(4000, "Invalid Request", HttpStatus.BAD_REQUEST),

    UNAUTHENTICATED(1001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1002, "Access denied", HttpStatus.FORBIDDEN),
    ROLE_NOT_FOUND(1003, "Role not found", HttpStatus.NOT_FOUND),

    CATEGORY_NOT_FOUND(2001, "Category not found", HttpStatus.NOT_FOUND),

    NOTIFICATION_TEMPLATE_NOT_FOUND(3001, "Template not found", HttpStatus.NOT_FOUND),
    NOTIFICATION_SEND_FAILED(3002, "Failed to send notification", HttpStatus.INTERNAL_SERVER_ERROR),

    ASSET_NOT_FOUND(4001, "Asset not found", HttpStatus.NOT_FOUND),
    ASSET_UPLOAD_FAILED(4002, "Failed to upload asset", HttpStatus.INTERNAL_SERVER_ERROR),
    ASSET_DELETE_FAILED(4003, "Failed to delete asset", HttpStatus.INTERNAL_SERVER_ERROR),

    EMAIL_ALREADY_IN_USE(5001, "Email already in use", HttpStatus.CONFLICT),
    OTP_EXPIRED(5002, "OTP has expired", HttpStatus.BAD_REQUEST),
    OTP_ATTEMPTS_EXCEEDED(5003, "OTP attempts exceeded", HttpStatus.BAD_REQUEST),
    OTP_INVALID(5004, "Invalid OTP", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_FOUND(5005, "Account not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS(5006, "Invalid credentials", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(5007, "Token has expired", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(5008, "Invalid token", HttpStatus.UNAUTHORIZED),
    TOKEN_REVOKED(5009, "Token has been revoked", HttpStatus.UNAUTHORIZED),
    ADDRESS_ALREADY_EXISTS(5010, "Address already exists", HttpStatus.CONFLICT),
    ADDRESS_NOT_FOUND(5011, "Address not found", HttpStatus.NOT_FOUND),

    PRODUCT_NOT_FOUND(6001, "Product not found", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(6002, "Insufficient stock", HttpStatus.BAD_REQUEST),;

    private int code;
    private String message;
    private HttpStatus status;
}
