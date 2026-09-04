package com.minn.organicfood.shared.exception;

import org.springframework.http.HttpStatus;

public interface BaseErrorCode {
    int getCode();

    String getMessage();

    HttpStatus getStatus();
}
