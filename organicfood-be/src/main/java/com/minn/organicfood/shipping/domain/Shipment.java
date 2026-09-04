package com.minn.organicfood.shipping.domain;

import com.minn.organicfood.shared.domain.BaseEntity;
import com.minn.organicfood.shipping.domain.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "shipments",
        schema = "shipping"
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Shipment extends BaseEntity<UUID> {

    @Id
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    private UUID id;

    @Column(name = "order_id")
    private UUID orderId;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private String carrier;
    private String trackingCode;
    private String addressLine;
    private Instant shippedAt;
    private Instant deliveredAt;

    @CreatedDate
    private Instant createdAt;
}
