package com.minn.organicfood.identity.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class TokenPayload {
    private String accountId;
    private List<String> authorities;
    private String email;
}

