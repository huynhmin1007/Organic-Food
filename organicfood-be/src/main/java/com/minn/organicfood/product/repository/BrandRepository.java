package com.minn.organicfood.product.repository;

import com.minn.organicfood.product.domain.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    @Query("""
            SELECT DISTINCT b FROM Brand b
            JOIN BrandCategory bc ON bc.brandId = b.id
            WHERE bc.categoryId IN :categoryIds
            """)
    List<Brand> findByCategoryIds(@Param("categoryIds") List<Long> categoryIds);
}
