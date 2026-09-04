package com.minn.organicfood.product.repository;

import com.minn.organicfood.product.domain.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    @Query("""
            SELECT pi.assetUrl
            FROM ProductImage pi
            WHERE pi.productId = :productId
            """)
    List<String> findUrlsByProductId(@Param("productId") UUID productId);
}
