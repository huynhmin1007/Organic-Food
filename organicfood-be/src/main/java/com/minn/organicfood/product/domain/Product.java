package com.minn.organicfood.product.domain;

import com.minn.organicfood.shared.domain.AuditableEntity;
import com.minn.organicfood.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(
        name = "products",
        schema = "product"
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Product extends AuditableEntity<UUID> {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID id;

    private Long categoryId;

    private Long brandId;

    private String name;
    private String slug;
    private String sku;
    private UUID thumbnailId;
    private String thumbnailUrl;
    private String shortDescription;

    private String featureSpecification;

    private String productArticle;
    private Integer packQuantity;
    private String packUnit;
    private String packDetail;
    private BigDecimal price;
    private Integer stockQuantity;

    @Column(name = "is_active")
    private boolean active;

    @OneToMany(mappedBy = "product")
    private Set<ProductSaleCounter> saleCounters;
}
