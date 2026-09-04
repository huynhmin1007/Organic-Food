package com.minn.organicfood.product.repository;

import com.minn.organicfood.product.domain.ProductDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ProductDiscountRepository extends JpaRepository<ProductDiscount, UUID> {

    @Query("""
            SELECT d FROM ProductDiscount d
            WHERE d.productId IN :productIds
              AND d.active = true
              AND d.startAt <= :now
              AND (d.endAt IS NULL OR d.endAt > :now)
            """)
    List<ProductDiscount> findActiveForProducts(@Param("productIds") List<UUID> productIds, @Param("now") Instant now);
}