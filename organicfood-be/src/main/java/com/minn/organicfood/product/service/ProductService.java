package com.minn.organicfood.product.service;

import com.minn.organicfood.product.domain.Product;
import com.minn.organicfood.product.domain.ProductDiscount;
import com.minn.organicfood.product.domain.enums.SalePeriodType;
import com.minn.organicfood.product.dto.enums.ProductSortType;
import com.minn.organicfood.product.dto.projection.ProductDetailCoreProjection;
import com.minn.organicfood.product.dto.request.ProductFilterRequest;
import com.minn.organicfood.product.dto.response.ProductDetailResponse;
import com.minn.organicfood.product.dto.response.ProductResponse;
import com.minn.organicfood.product.mapper.ProductMapper;
import com.minn.organicfood.product.repository.CategoryRepository;
import com.minn.organicfood.product.repository.ProductDiscountRepository;
import com.minn.organicfood.product.repository.ProductImageRepository;
import com.minn.organicfood.product.repository.ProductRepository;
import com.minn.organicfood.product.specification.ProductSpecification;
import com.minn.organicfood.shared.dto.PageResponse;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import com.minn.organicfood.shared.infra.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.IsoFields;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductDiscountRepository productDiscountRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper mapper;
    private final RedisService redisService;

    public ProductDetailResponse findDetail(UUID id, String slug) {
        ProductDetailCoreProjection core = productRepository.findDetail(id, slug)
                .orElseThrow(() -> BusinessException.of(ErrorCode.PRODUCT_NOT_FOUND));

        List<String> galleryImages = productImageRepository.findUrlsByProductId(core.id());
        List<ProductDiscount> discounts = productDiscountRepository.findActiveForProducts(List.of(core.id()), Instant.now());

        return mapper.toDetailResponse(core, galleryImages, discounts);
    }

    public PageResponse<ProductResponse> filterProducts(ProductFilterRequest filter) {
        if (filter.getProductIds() != null && !filter.getProductIds().isEmpty()) {
            List<Product> products = productRepository.findAllById(filter.getProductIds());
            List<UUID> ids = products.stream().map(Product::getId).toList();
            Map<UUID, List<ProductDiscount>> discounts = productDiscountRepository.findActiveForProducts(ids, Instant.now()).stream()
                    .collect(Collectors.groupingBy(ProductDiscount::getProductId));

            List<ProductResponse> mapped = products.stream()
                    .map(product -> mapper.toListItemResponse(
                            product, discounts.getOrDefault(product.getId(), List.of())))
                    .toList();

            return PageResponse.of(new PageImpl<>(mapped));
        }

        Specification<Product> spec = ProductSpecification.fromFilter(filter, resolveCategoryIds(filter));
        Pageable pageable;

        if (filter.getSort().isBestSelling()) {
            SalePeriodType periodType = resolvePeriodType(filter.getSort());
            String periodKey = resolveBestsellerKey(filter.getSort());
            spec = spec.and(ProductSpecification.orderByBestSelling(periodType, periodKey));
            pageable = PageRequest.of(filter.getPage(), filter.getSize());
        } else {
            pageable = PageRequest.of(filter.getPage(), filter.getSize(), resolveSort(filter.getSort()));
        }

        Page<Product> page = productRepository.findAll(spec, pageable);

        return PageResponse.of(enrichWithDiscounts(page, filter.getOnSale()));
    }

    public boolean existsById(UUID productId) {
        return productRepository.existsById(productId);
    }

    private Page<ProductResponse> enrichWithDiscounts(Page<Product> page, Boolean onSale) {
        List<Product> products = page.getContent();

        if (products.isEmpty()) {
            return new PageImpl<>(List.of(), page.getPageable(), page.getTotalElements());
        }

        if (Boolean.FALSE.equals(onSale)) {
            List<ProductResponse> mapped = products.stream()
                    .map(product -> mapper.toListItemResponse(product, List.of()))
                    .toList();
            return new PageImpl<>(mapped, page.getPageable(), page.getTotalElements());
        }

        List<UUID> ids = products.stream().map(Product::getId).toList();
        Map<UUID, List<ProductDiscount>> discounts = productDiscountRepository.findActiveForProducts(ids, Instant.now()).stream()
                .collect(Collectors.groupingBy(ProductDiscount::getProductId));

        List<ProductResponse> mapped = products.stream()
                .map(product -> mapper.toListItemResponse(
                        product, discounts.getOrDefault(product.getId(), List.of())))
                .toList();

        return new PageImpl<>(mapped, page.getPageable(), page.getTotalElements());
    }

    private List<Long> resolveCategoryIds(ProductFilterRequest filter) {
        List<Long> categoryIds = filter.getCategoryIds();
        List<String> slugs = filter.getCategorySlugs();

        boolean hasIds = categoryIds != null && !categoryIds.isEmpty();
        boolean hasSlugs = slugs != null && !slugs.isEmpty();

        if (!hasIds && !hasSlugs) {
            return null;
        }

        Long[] idArray = hasIds ? categoryIds.toArray(new Long[0]) : null;
        String[] slugArray = hasSlugs ? slugs.toArray(new String[0]) : null;

        boolean includeDescendants = Boolean.TRUE.equals(filter.getIncludeDescendants());

        return includeDescendants
                ? categoryRepository.findIdAndDescendantIds(idArray, slugArray)
                : categoryRepository.findIds(idArray, slugArray);
    }

    private String resolveBestsellerKey(ProductSortType sort) {
        LocalDate today = LocalDate.now();
        return switch (sort) {
            case BEST_SELLING_WEEKLY -> "bestseller:weekly:"
                    + today.get(IsoFields.WEEK_BASED_YEAR) + "-W" + today.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
            case BEST_SELLING_MONTHLY -> "bestseller:monthly:" + YearMonth.from(today);
            default -> throw new IllegalArgumentException("Not a bestseller sort: " + sort);
        };
    }

    private Sort resolveSort(ProductSortType sort) {
        return switch (sort) {
            case PRICE_ASC -> Sort.by(Sort.Direction.ASC, "price");
            case PRICE_DESC -> Sort.by(Sort.Direction.DESC, "price");
            case NAME_ASC -> Sort.by(Sort.Direction.ASC, "name");
            case NAME_DESC -> Sort.by(Sort.Direction.DESC, "name");
            default -> throw new IllegalStateException(
                    "resolveSort() only handles plain-column sorts - " + sort + " should have gone through filterByBestSelling()");
        };
    }

    private SalePeriodType resolvePeriodType(ProductSortType sort) {
        return switch (sort) {
            case BEST_SELLING_WEEKLY -> SalePeriodType.WEEKLY;
            case BEST_SELLING_MONTHLY -> SalePeriodType.MONTHLY;
            default -> throw new IllegalArgumentException("Not a bestseller sort: " + sort);
        };
    }

    @Transactional
    public void decrementStock(UUID productId, int quantity) {
        productRepository.decrementStock(productId, quantity);
    }

    public Product getProductById(UUID productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> BusinessException.of(ErrorCode.PRODUCT_NOT_FOUND));
    }

    public Product getAndLockProduct(UUID productId) {
        return productRepository.findAndLockById(productId)
                .orElseThrow(() -> BusinessException.of(ErrorCode.PRODUCT_NOT_FOUND));
    }
}
