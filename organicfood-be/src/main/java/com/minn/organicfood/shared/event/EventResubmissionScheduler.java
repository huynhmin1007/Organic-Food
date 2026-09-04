package com.minn.organicfood.shared.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.modulith.events.IncompleteEventPublications;

import java.time.Duration;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventResubmissionScheduler {

    private static final Duration RESUBMIT_OLDER_THAN = Duration.ofSeconds(30);

    private final IncompleteEventPublications incompleteEventPublications;

//

}
