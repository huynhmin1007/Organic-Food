package com.minn.organicfood.product.service;

import com.minn.organicfood.product.dto.request.BrandFilterRequest;
import com.minn.organicfood.product.dto.response.BrandResponse;
import com.minn.organicfood.product.mapper.BrandMapper;
import com.minn.organicfood.product.repository.BrandRepository;
import com.minn.organicfood.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final BrandMapper mapper;

    public List<BrandResponse> filterBrands(BrandFilterRequest filter) {
        List<Long> categoryIds = filter.getIncludeDescendants()
                ? categoryRepository.findIdAndDescendantIds(filter.getCategoryId(), filter.getCategorySlug(), null)
                : List.of(filter.getCategoryId());

        return mapper.toResponse(brandRepository.findByCategoryIds(categoryIds));
    }
}
