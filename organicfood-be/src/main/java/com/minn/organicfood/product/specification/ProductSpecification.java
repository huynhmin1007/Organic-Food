package com.minn.organicfood.product.specification;

import com.minn.organicfood.product.domain.Brand;
import com.minn.organicfood.product.domain.Product;
import com.minn.organicfood.product.domain.ProductDiscount;
import com.minn.organicfood.product.domain.ProductSaleCounter;
import com.minn.organicfood.product.domain.enums.SalePeriodType;
import com.minn.organicfood.product.dto.request.ProductFilterRequest;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> hasCategory(List<Long> categoryIds) {
        if (categoryIds == null) {
            return (root, query, cb) -> cb.conjunction();  // không filter -> match tất cả
        }
        if (categoryIds.isEmpty()) {
            return (root, query, cb) -> cb.disjunction();  // filter nhưng ko tìm thấy category -> match không gì cả
        }
        return (root, query, cb) -> root.get("categoryId").in(categoryIds);
    }

    public static Specification<Product> hasBrand(List<Long> brandIds, List<String> brandSlugs) {
        boolean hasIds = brandIds != null && !brandIds.isEmpty();
        boolean hasSlugs = brandSlugs != null && !brandSlugs.isEmpty();

        if (!hasIds && !hasSlugs) {
            return (root, query, cb) -> cb.conjunction(); // không lọc theo brand
        }

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (hasIds) {
                predicates.add(root.get("brandId").in(brandIds));
            }

            if (hasSlugs) {
                Subquery<Long> subquery = query.subquery(Long.class);
                Root<Brand> brandRoot = subquery.from(Brand.class);
                subquery.select(brandRoot.get("id"))
                        .where(brandRoot.get("slug").in(brandSlugs));

                predicates.add(root.get("brandId").in(subquery));
            }

            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Product> hasNameLike(String keyword) {
        return (root, query, cb) ->
                cb.like(
                        cb.lower(root.get("name")),
                        "%" + keyword.toLowerCase() + "%"
                );
    }

    public static Specification<Product> hasPriceBetween(Long minPrice, Long maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) return cb.conjunction();
            if (minPrice == null) return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
            if (maxPrice == null) return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            return cb.between(root.get("price"), minPrice, maxPrice);
        };
    }

    public static Specification<Product> hasOnSale(Boolean onSale) {
        return (root, query, cb) -> {
            if (onSale == null) return cb.conjunction();

            Subquery<UUID> subquery = query.subquery(UUID.class);
            Root<ProductDiscount> discountRoot = subquery.from(ProductDiscount.class);
            LocalDateTime now = LocalDateTime.now();

            subquery.select(discountRoot.get("id"))
                    .where(
                            cb.equal(discountRoot.get("productId"), root.get("id")),
                            cb.isTrue(discountRoot.get("active")),
                            cb.lessThanOrEqualTo(discountRoot.get("startAt"), now),
                            cb.or(
                                    cb.isNull(discountRoot.get("endAt")),
                                    cb.greaterThan(discountRoot.get("endAt"), now)
                            )
                    );

            Predicate exists = cb.exists(subquery);
            return onSale ? exists : cb.not(exists);
        };
    }

    public static Specification<Product> orderByBestSelling(SalePeriodType periodType, String periodKey) {
        return (root, query, cb) -> {
            Join<Product, ProductSaleCounter> counterJoin = root.join("saleCounters", JoinType.LEFT);
            counterJoin.on(
                    cb.equal(counterJoin.get("periodType"), periodType),
                    cb.equal(counterJoin.get("periodKey"), periodKey)
            );

            query.orderBy(cb.desc(cb.coalesce(counterJoin.get("quantitySold"), 0L)));

            return cb.conjunction();
        };
    }

    public static Specification<Product> fromFilter(ProductFilterRequest filter, List<Long> resolvedCategoryIds) {
        Specification<Product> spec = (root, query, cb) -> cb.conjunction();

        if (resolvedCategoryIds != null && !resolvedCategoryIds.isEmpty())
            spec = spec.and(hasCategory(resolvedCategoryIds));

        if (filter.getBrandIds() != null || filter.getBrandSlugs() != null)
            spec = spec.and(hasBrand(filter.getBrandIds(), filter.getBrandSlugs()));

        if (StringUtils.hasText(filter.getKeyword()))
            spec = spec.and(hasNameLike(filter.getKeyword()));

        if (filter.getMinPrice() != null || filter.getMaxPrice() != null)
            spec = spec.and(hasPriceBetween(filter.getMinPrice(), filter.getMaxPrice()));

        if (filter.getOnSale() != null)
            spec = spec.and(hasOnSale(filter.getOnSale()));

        return spec;
    }
}
