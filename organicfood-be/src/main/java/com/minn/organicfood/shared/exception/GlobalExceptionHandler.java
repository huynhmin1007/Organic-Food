package com.minn.organicfood.shared.exception;

import com.minn.organicfood.shared.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        BaseErrorCode code = e.getErrorCode();

        if (e.getContext() != null) {
            log.warn("[{}] {} | context={}", code.getCode(), e.getClientMessage(), e.getContext());
        } else {
            log.warn("[{}] {}", code.getCode(), e.getClientMessage());
        }

        return ResponseEntity
                .status(code.getStatus())
                .body(ApiResponse.error(code.getCode(), e.getClientMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException e) {
        Map<String, Object> errors = new TreeMap<>();

        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), buildMessage(error));
        }

        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(
                        ErrorCode.INVALID_REQUEST.getCode(),
                        ErrorCode.INVALID_REQUEST.getMessage(),
                        null,
                        errors)
                );
    }

    private String buildMessage(FieldError error) {
        if (error.contains(TypeMismatchException.class)) {
            TypeMismatchException tme = error.unwrap(TypeMismatchException.class);
            Class<?> requiredType = tme.getRequiredType();

            if (requiredType != null && requiredType.isEnum()) {
                return "Invalid value '%s'. Accepted values: %s".formatted(
                        error.getRejectedValue(),
                        Arrays.toString(requiredType.getEnumConstants())
                );
            }

            if (requiredType != null) {
                return "Invalid value '%s' for type %s".formatted(
                        error.getRejectedValue(), requiredType.getSimpleName());
            }
        }

        return error.getDefaultMessage();
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AuthorizationDeniedException e) {
        log.warn("Access Denied: {}", e.getMessage());

        return ResponseEntity
                .status(403)
                .body(ApiResponse.error(
                        ErrorCode.UNAUTHORIZED.getCode(),
                        ErrorCode.UNAUTHORIZED.getMessage()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception e) {
        log.error("Unhandled Exception: ", e);

        return ResponseEntity
                .internalServerError()
                .body(ApiResponse.error(
                        ErrorCode.INTERNAL_ERROR.getCode(),
                        ErrorCode.INTERNAL_ERROR.getMessage()
                ));
    }
}
