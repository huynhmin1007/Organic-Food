package com.minn.organicfood.shared.validation.annotation;

import com.minn.organicfood.shared.validation.validator.PasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default "Password must be at least 8 characters long, containing at least 1 digit and 1 special character";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
