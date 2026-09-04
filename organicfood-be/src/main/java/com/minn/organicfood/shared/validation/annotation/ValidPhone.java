package com.minn.organicfood.shared.validation.annotation;

import com.minn.organicfood.shared.validation.validator.PhoneValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
public @interface ValidPhone {
    String message() default "Phone number must be a valid E.164 phone number";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
