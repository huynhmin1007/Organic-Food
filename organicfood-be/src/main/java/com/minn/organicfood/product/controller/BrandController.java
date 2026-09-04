package com.minn.organicfood.product.controller;

import com.minn.organicfood.product.dto.request.BrandFilterRequest;
import com.minn.organicfood.product.dto.response.BrandResponse;
import com.minn.organicfood.product.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public List<BrandResponse> filterBrands(@ModelAttribute @Valid BrandFilterRequest filter) {
        return brandService.filterBrands(filter);
    }
}
