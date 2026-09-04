package com.minn.organicfood;

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
