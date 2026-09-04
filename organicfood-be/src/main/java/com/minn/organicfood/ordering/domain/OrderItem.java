package com.minn.organicfood.ordering.domain;

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

    private UUID orderId;

    private UUID productId;
    private String productName;
    private String productSku;

    private UUID discountId;
    private String discountType;
    private String discountLabel;

    private Integer quantity;
    private BigDecimal unitPrice;
    private Integer freeQuantity;
    private BigDecimal lineTotal;
}
