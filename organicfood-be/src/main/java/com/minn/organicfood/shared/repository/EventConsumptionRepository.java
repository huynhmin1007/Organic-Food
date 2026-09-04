package com.minn.organicfood.shared.repository;

import com.minn.organicfood.shared.domain.EventConsumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventConsumptionRepository extends JpaRepository<EventConsumption, UUID> {
    Optional<EventConsumption> findByEventIdAndConsumer(String eventId, String consumer);
}
