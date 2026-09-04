package com.minn.organicfood.product.controller;

import com.minn.organicfood.product.dto.request.ProductFilterRequest;
import com.minn.organicfood.product.dto.response.ProductDetailResponse;
import com.minn.organicfood.product.dto.response.ProductResponse;
import com.minn.organicfood.product.service.ProductService;
import com.minn.organicfood.shared.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public PageResponse<ProductResponse> filterProducts(@ModelAttribute @Valid ProductFilterRequest filter) {
        return productService.filterProducts(filter);
    }

    @GetMapping("/{productId}")
    public ProductDetailResponse findDetail(@PathVariable UUID productId) {
        return productService.findDetail(productId, null);
    }

    @GetMapping("/slug/{productSlug}")
    public ProductDetailResponse findDetail(@PathVariable String productSlug) {
        return productService.findDetail(null, productSlug);
    }
}
