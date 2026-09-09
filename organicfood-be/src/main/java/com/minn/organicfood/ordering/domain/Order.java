package com.minn.organicfood.ordering.domain;

import com.minn.organicfood.ordering.domain.enums.OrderStatus;
import com.minn.organicfood.shared.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(
        name = "orders",
        schema = "ordering"
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Order extends AuditableEntity<UUID> {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID id;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Column(name = "customer_id")
    private UUID customerId;

    @Column(name = "idempotency_key")
    private String idempotencyKey;

    private String code;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private BigDecimal totalAmount;
    private BigDecimal discountAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<OrderItem> items = new HashSet<>();
}
