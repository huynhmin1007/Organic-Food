package com.minn.organicfood.product.dto.response;

import java.util.List;

public record CategoryNodeResponse(
        Long id,
        String name,
        String slug,
        String imageUrl,
        List<CategoryNodeResponse> children
) {
}
