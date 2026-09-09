package com.minn.organicfood.product.service;

import com.minn.organicfood.product.domain.Product;
import com.minn.organicfood.product.domain.ProductDiscount;
import com.minn.organicfood.product.dto.response.DiscountLineResult;
import com.minn.organicfood.product.repository.ProductDiscountRepository;
import com.minn.organicfood.product.repository.ProductRepository;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DiscountCalculator {

    private final ProductRepository productRepository;
    private final ProductDiscountRepository productDiscountRepository;

    public DiscountLineResult pickBestLine(Product product, int quantity) {
        List<ProductDiscount> discounts = productDiscountRepository.findActiveForProducts(
                List.of(product.getId()), Instant.now());

        DiscountLineResult bestResult = compute(product, null, quantity);
        BigDecimal bestBenefit = BigDecimal.ZERO;

        for (ProductDiscount discount : discounts) {
            DiscountLineResult candidate = compute(product, discount, quantity);
            BigDecimal candidateBenefit = benefit(candidate);
            if (candidateBenefit.compareTo(bestBenefit) > 0) {
                bestBenefit = candidateBenefit;
                bestResult = candidate;
            }
        }

        return bestResult;
    }

    private BigDecimal benefit(DiscountLineResult result) {
        BigDecimal totalUnitsReceived = BigDecimal.valueOf(result.quantity() + result.freeQuantity());
        BigDecimal valueReceived = result.originalPrice().multiply(totalUnitsReceived);
        return valueReceived.subtract(result.lineTotal());
    }

    public DiscountLineResult compute(Product product, ProductDiscount discount, int orderedQty) {
        BigDecimal originalPrice = product.getPrice();

        if (discount == null) {
            return DiscountLineResult.noDiscount(product.getId(), orderedQty, originalPrice);
        }

        return switch (discount.getDiscountType()) {
            case PERCENTAGE -> percentage(discount, orderedQty, originalPrice);
            case FIXED_PRICE_FOR_QUANTITY -> fixedPriceForQuantity(discount, orderedQty, originalPrice);
            case BUY_X_GET_Y_FREE -> buyXGetYFree(discount, orderedQty, originalPrice);
            case BUY_X_GET_Y_PERCENT_OFF -> buyXGetYPercentOff(discount, orderedQty, originalPrice);
            default -> throw new IllegalStateException("Unknown discount_type: " + discount.getDiscountType());
        };
    }

    private DiscountLineResult percentage(ProductDiscount discount, int quantity, BigDecimal originalPrice) {
        BigDecimal multiplier = BigDecimal.ONE.subtract(discount.getDiscountPercent().divide(BigDecimal.valueOf(100)));
        BigDecimal unitPrice = originalPrice.multiply(multiplier)
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));

        return DiscountLineResult.builder()
                .productId(discount.getProductId())
                .quantity(quantity)
                .freeQuantity(0)
                .unitPrice(unitPrice)
                .originalPrice(originalPrice)
                .lineTotal(lineTotal)
                .discountId(discount.getId())
                .discountLabel(discount.getLabel())
                .discountType(discount.getDiscountType())
                .build();
    }

    private DiscountLineResult fixedPriceForQuantity(ProductDiscount discount, int quantity, BigDecimal originalPrice) {
        int buyQty = discount.getBuyQuantity();
        int fullBundles = quantity / buyQty;
        int remainder = quantity % buyQty;

        BigDecimal lineTotal = discount.getFixedPrice().multiply(BigDecimal.valueOf(fullBundles))
                .add(originalPrice.multiply(BigDecimal.valueOf(remainder)));
        BigDecimal unitPrice = quantity > 0
                ? lineTotal.divide(BigDecimal.valueOf(quantity), 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return DiscountLineResult.builder()
                .productId(discount.getProductId())
                .quantity(quantity)
                .freeQuantity(0)
                .unitPrice(unitPrice)
                .originalPrice(originalPrice)
                .lineTotal(lineTotal)
                .discountId(discount.getId())
                .discountLabel(discount.getLabel())
                .discountType(discount.getDiscountType())
                .build();
    }

    private DiscountLineResult buyXGetYFree(ProductDiscount discount, int quantity, BigDecimal originalPrice) {
        int freeQty = (quantity * discount.getGetQuantity()) / discount.getBuyQuantity();
        BigDecimal lineTotal = originalPrice.multiply(BigDecimal.valueOf(quantity));

        return DiscountLineResult.builder()
                .productId(discount.getProductId())
                .quantity(quantity)
                .freeQuantity(freeQty)
                .unitPrice(originalPrice)
                .originalPrice(originalPrice)
                .lineTotal(lineTotal)
                .discountId(discount.getId())
                .discountLabel(discount.getLabel())
                .discountType(discount.getDiscountType())
                .build();
    }

    private DiscountLineResult buyXGetYPercentOff(ProductDiscount discount, int quantity, BigDecimal originalPrice) {
        int cycleSize = discount.getBuyQuantity() + discount.getGetQuantity();
        int discountedUnits = (quantity * discount.getGetQuantity()) / cycleSize;
        int fullPriceUnits = quantity - discountedUnits;

        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
                discount.getDiscountPercent().divide(BigDecimal.valueOf(100)));
        BigDecimal lineTotal = originalPrice.multiply(BigDecimal.valueOf(fullPriceUnits))
                .add(originalPrice.multiply(discountMultiplier).multiply(BigDecimal.valueOf(discountedUnits)));
        BigDecimal unitPrice = quantity > 0
                ? lineTotal.divide(BigDecimal.valueOf(quantity), 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return DiscountLineResult.builder()
                .productId(discount.getProductId())
                .quantity(quantity)
                .freeQuantity(0)
                .unitPrice(unitPrice)
                .originalPrice(originalPrice)
                .lineTotal(lineTotal)
                .discountId(discount.getId())
                .discountLabel(discount.getLabel())
                .discountType(discount.getDiscountType())
                .build();
    }
}
