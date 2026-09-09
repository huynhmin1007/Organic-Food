package com.minn.organicfood.product.repository;

import com.minn.organicfood.product.domain.Product;
import com.minn.organicfood.product.dto.projection.ProductDetailCoreProjection;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    @Query("""
            SELECT new com.minn.organicfood.product.dto.projection.ProductDetailCoreProjection(
                p.id, p.name, p.slug, p.sku,
                p.packQuantity, p.packUnit, p.packDetail,
                p.price, p.stockQuantity,
                p.shortDescription, p.featureSpecification, p.productArticle,
                p.thumbnailUrl,
                c.id, c.name, c.slug, c.imageUrl,
                b.id, b.name, b.slug, b.imageUrl
            )
            FROM Product p
            JOIN Category c ON c.id = p.categoryId
            JOIN Brand b ON b.id = p.brandId
            WHERE (:id IS NOT NULL AND p.id = :id) OR (:slug IS NOT NULL AND p.slug = :slug)
            """)
    Optional<ProductDetailCoreProjection> findDetail(@Param("id") UUID id, @Param("slug") String slug);

    @Modifying
    @Query("""
            UPDATE Product p
            SET p.stockQuantity = p.stockQuantity - :quantity
            WHERE p.id = :id AND p.stockQuantity >= :quantity
            """)
    void decrementStock(@Param("id") UUID id, @Param("quantity") Integer quantity);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findAndLockById(@Param("id") UUID id);
}
