package com.minn.organicfood.ordering.dto.request;

import com.minn.organicfood.shared.validation.annotation.ValidPhone;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Data
public class PlaceOrderRequest {

    @NotBlank(message = "Idempotency key cannot be blank")
    private String idempotencyKey;

    @ValidPhone
    @NotBlank(message = "Phone must be required")
    String phone;

    @NotBlank(message = "Address must be required")
    String address;

    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderLineRequest> items;
}
