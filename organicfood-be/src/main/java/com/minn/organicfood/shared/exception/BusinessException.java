package com.minn.organicfood.shared.exception;

import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.Map;

@Getter
public class BusinessException extends RuntimeException {

    private final BaseErrorCode errorCode;
    private String detail;
    private transient Map<String, Object> context;       // chỉ để log nội bộ, KHÔNG trả về client

    private BusinessException(BaseErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public static BusinessException of(BaseErrorCode errorCode) {
        return new BusinessException(errorCode, errorCode.getMessage());
    }

    public static BusinessException of(BaseErrorCode errorCode, Object... args) {
        return new BusinessException(errorCode, errorCode.getMessage().formatted(args));
    }

    public BusinessException withDetail(String detail) {
        this.detail = detail;
        return this;
    }

    public BusinessException withDetail(String format, Object... args) {
        this.detail = format.formatted(args);
        return this;
    }

    public BusinessException withContext(String key, Object value) {
        if (context == null) context = new LinkedHashMap<>();
        context.put(key, value);
        return this;
    }

    public String getClientMessage() {
        return detail != null ? "%s (%s)".formatted(getMessage(), detail) : getMessage();
    }
}
