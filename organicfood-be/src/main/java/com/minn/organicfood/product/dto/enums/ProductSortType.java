package com.minn.organicfood.product.dto.enums;

public enum ProductSortType {
    BEST_SELLING_WEEKLY,   // default
    BEST_SELLING_MONTHLY,
    PRICE_ASC,
    PRICE_DESC,
    NAME_ASC,
    NAME_DESC;

    public boolean isBestSelling() {
        return this == BEST_SELLING_WEEKLY || this == BEST_SELLING_MONTHLY;
    }
}
