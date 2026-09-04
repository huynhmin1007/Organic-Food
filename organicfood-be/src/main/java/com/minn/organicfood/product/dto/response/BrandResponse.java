package com.minn.organicfood.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class BrandResponse {

    private Long id;
    private String name;
    private String slug;
    private String imageUrl;

}
