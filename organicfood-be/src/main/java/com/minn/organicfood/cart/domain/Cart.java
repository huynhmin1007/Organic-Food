package com.minn.organicfood.cart.domain;

import lombok.*;

import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Cart {
    private Map<UUID, Integer> items;
}
