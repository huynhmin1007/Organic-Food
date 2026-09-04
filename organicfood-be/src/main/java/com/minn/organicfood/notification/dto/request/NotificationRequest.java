package com.minn.organicfood.notification.dto.request;


import com.minn.organicfood.notification.domain.enums.NotificationChannel;
import com.minn.organicfood.notification.domain.enums.NotificationCode;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    NotificationChannel channel;
    String recipient;
    NotificationCode templateCode;
    Map<String, String> variables;
}
