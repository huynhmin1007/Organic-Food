package com.minn.organicfood.notification.infra;

import lombok.*;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Builder
@NoArgsConstructor
@Getter
@Setter
public class BrevoSendMailRequest{
    private Sender sender;
    private List<Recipient> to;
    private String subject;
    private String htmlContent;
    private Map<String, Object> params;

    public record Sender(
            String name,
            String email
    ) {
    }

    public record Recipient(
            String email
    ) {
    }
}