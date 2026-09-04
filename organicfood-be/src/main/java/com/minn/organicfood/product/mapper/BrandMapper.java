package com.minn.organicfood.product.mapper;

import com.minn.organicfood.product.domain.Brand;
import com.minn.organicfood.product.dto.response.BrandResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    BrandResponse toResponse(Brand brand);
    List<BrandResponse> toResponse(List<Brand> brands);
}
