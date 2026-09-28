package com.minn.organicfood.product.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class BrandFilterRequest {

    @Min(0)
    private Long categoryId;
    private String categorySlug;
    private Boolean includeDescendants = false;
    private String keyword;
}
