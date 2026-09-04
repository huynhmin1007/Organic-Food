package com.minn.organicfood.notification.repository;

import com.minn.organicfood.notification.domain.NotificationTemplate;
import com.minn.organicfood.notification.domain.enums.NotificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, UUID> {

    Optional<NotificationTemplate> findByCode(NotificationCode code);
}
