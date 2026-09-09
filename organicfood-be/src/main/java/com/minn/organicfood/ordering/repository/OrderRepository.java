package com.minn.organicfood.ordering.repository;

import com.minn.organicfood.ordering.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByIdempotencyKey(String idempotencyKey);
    List<Order> findByCustomerId(UUID customerId);
}
