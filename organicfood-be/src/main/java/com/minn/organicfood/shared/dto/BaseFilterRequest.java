package com.minn.organicfood.shared.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseFilterRequest {

    @Min(value = 0, message = "page must be greater than 0")
    private int page;

    @Min(value = 1, message = "size must be greater than 1")
    @Max(value = 100, message = "size must be not exceed 100")
    private int size = 20;
}
