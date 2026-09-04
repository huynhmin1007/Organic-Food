package com.minn.organicfood.product.domain;

import com.minn.organicfood.product.domain.enums.SalePeriodType;
import com.minn.organicfood.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(
        name = "product_sale_period_counters",
        schema = "product"
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ProductSaleCounter extends BaseEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "product_id",
            insertable = false,
            updatable = false
    )
    private Product product;

    @Enumerated(EnumType.STRING)
    private SalePeriodType periodType;

    private String periodKey;
    private Integer quantitySold;
}
