package com.minn.organicfood.shared.validation.validator;

import com.minn.organicfood.shared.validation.annotation.ValidPhone;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<ValidPhone, String> {

    /**
     * E.164
     * +84xxxxxxxxx
     * max 15 chars
     */
    private static final String REGEX = "^\\+[1-9]\\d{7,14}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {

        if (value == null || value.isBlank()) {
            return true;
        }

        return value.matches(REGEX);
    }
}
