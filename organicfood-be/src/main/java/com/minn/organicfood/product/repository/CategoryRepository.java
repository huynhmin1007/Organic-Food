package com.minn.organicfood.product.repository;

import com.minn.organicfood.product.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query(value = """
        WITH RECURSIVE root AS (
            SELECT id FROM product.categories
            WHERE (CAST(:categoryIds AS bigint[]) IS NOT NULL AND id = ANY(CAST(:categoryIds AS bigint[])))
               OR (CAST(:slugs AS text[]) IS NOT NULL AND slug = ANY(CAST(:slugs AS text[])))
        ),
        descendants AS (
            SELECT id FROM root
            UNION ALL
            SELECT c.id FROM product.categories c
            INNER JOIN descendants d ON c.parent_id = d.id
        )
        SELECT DISTINCT id FROM descendants
        """, nativeQuery = true)
    List<Long> findIdAndDescendantIds(@Param("categoryIds") Long[] categoryIds, @Param("slugs") String[] slugs);

    @Query(value = """
        WITH RECURSIVE root AS (
            SELECT id FROM product.categories
            WHERE (:categoryId IS NOT NULL AND id = :categoryId)
                OR (:slug IS NOT NULL AND slug = :slug)
        ),
        descendants AS (
            SELECT id FROM root
            UNION ALL
            SELECT c.id FROM product.categories c
            INNER JOIN descendants d ON c.parent_id = d.id
        )
        SELECT id FROM descendants
        """, nativeQuery = true)
    List<Long> findIdAndDescendantIds(
            @Param("categoryId") Long categoryId, @Param("slug") String slug, @Param("keyword") String keyword);

    @Query(value = """
        SELECT id FROM product.categories
        WHERE (CAST(:categoryIds AS bigint[]) IS NOT NULL AND id = ANY(CAST(:categoryIds AS bigint[])))
           OR (CAST(:slugs AS text[]) IS NOT NULL AND slug = ANY(CAST(:slugs AS text[])))
        """, nativeQuery = true)
    List<Long> findIds(@Param("categoryIds") Long[] categoryIds, @Param("slugs") String[] slugs);

    @Query(value = """
        SELECT id FROM product.categories
        WHERE (:categoryId IS NOT NULL AND id = :categoryId)
           OR (:slug IS NOT NULL AND slug = :slug)
        """, nativeQuery = true)
    Optional<Long> findId(@Param("categoryId") Long categoryId, @Param("slug") String slug);
}
