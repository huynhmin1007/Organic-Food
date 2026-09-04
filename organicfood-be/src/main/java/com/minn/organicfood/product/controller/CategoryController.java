package com.minn.organicfood.product.controller;

import com.minn.organicfood.product.dto.response.CategoryNodeResponse;
import com.minn.organicfood.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryNodeResponse> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/tree")
    public CategoryNodeResponse getCategoryTree(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String slug
    ) {
        return categoryService.getCategoryTree(id, keyword, slug);
    }
}
