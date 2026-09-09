package com.minn.organicfood.ordering.domain;

import com.minn.organicfood.product.domain.enums.DiscountType;
import com.minn.organicfood.shared.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "order_items",
        schema = "ordering"
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
public class OrderItem extends BaseEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID productId;
    private String productName;
    private String productSku;
    private String productImageUrl;

    private UUID discountId;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    private String discountLabel;

    private Integer quantity;
    private BigDecimal originalPrice;
    private BigDecimal unitPrice;
    private Integer freeQuantity;
    private BigDecimal lineTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}
