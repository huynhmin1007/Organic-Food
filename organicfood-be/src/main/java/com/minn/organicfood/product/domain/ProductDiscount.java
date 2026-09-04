package com.minn.organicfood.product.domain;

import com.minn.organicfood.product.domain.enums.DiscountType;
import com.minn.organicfood.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "product_discounts",
        schema = "product"
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class ProductDiscount extends BaseEntity<UUID> {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID id;

    private UUID productId;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    private String label;
    private BigDecimal discountPercent;
    private BigDecimal fixedPrice;
    private Integer buyQuantity;
    private Integer getQuantity;

    private Instant startAt;
    private Instant endAt;

    @Column(name = "is_active")
    private boolean active;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;
}
