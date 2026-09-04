package com.minn.organicfood.shared.event;

import com.minn.organicfood.shared.domain.EventConsumption;
import com.minn.organicfood.shared.repository.EventConsumptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class IdempotentEventGuard {

    private final EventConsumptionRepository repository;

    public void runOnce(EventEnvelope<?> envelope, String consumer, Runnable action) {
        try {
            repository.saveAndFlush(EventConsumption.builder()
                    .eventId(envelope.eventId())
                    .eventType(envelope.eventType().name())
                    .consumer(consumer)
                    .build());
        } catch (DataIntegrityViolationException e) {
            log.info("Event {} already handled by consumer={}, skip", envelope.eventId(), consumer);
            return;
        }

        action.run();

        repository.findByEventIdAndConsumer(envelope.eventId(), consumer)
                .ifPresent(EventConsumption::markSuccess);
    }
}
