package com.minn.organicfood.product.dto.request;

import com.minn.organicfood.product.dto.enums.ProductSortType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ProductFilterRequest {

    @Min(0)
    private int page;

    @Min(1)
    @Max(50)
    private int size = 20;

    private List<Long> categoryIds;
    private List<String> categorySlugs;
    private Boolean includeDescendants = false;

    private List<Long> brandIds;
    private List<String> brandSlugs;
    private String keyword;

    private Long minPrice;
    private Long maxPrice;
    private Boolean onSale = null;

    private ProductSortType sort = ProductSortType.BEST_SELLING_WEEKLY;

    private List<UUID> productIds;
}
