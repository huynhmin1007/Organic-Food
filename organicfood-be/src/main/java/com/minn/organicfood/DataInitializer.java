package com.minn.organicfood;

import com.minn.organicfood.identity.repository.AccountRepository;
import com.minn.organicfood.identity.repository.PermissionRepository;
import com.minn.organicfood.identity.repository.RoleRepository;
import com.minn.organicfood.ordering.repository.OrderItemRepository;
import com.minn.organicfood.ordering.repository.OrderRepository;
import com.minn.organicfood.profile.repository.UserAddressRepository;
import com.minn.organicfood.profile.repository.UserProfileRepository;
import com.minn.organicfood.shipping.repository.ShipmentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DataInitializer implements ApplicationRunner {

    IdentityDataInitializer identityDataInitializer;
    NotificationDataInitializer notificationDataInitializer;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("=== Starting data initialization ===");
        identityDataInitializer.init();
        notificationDataInitializer.init();

        log.info("=== Data initialization complete ===");
    }
}
