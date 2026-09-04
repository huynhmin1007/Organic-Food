package com.minn.organicfood.profile.controller;

import com.github.f4b6a3.uuid.exception.InvalidUuidException;
import com.minn.organicfood.profile.dto.request.AddUserAddressRequest;
import com.minn.organicfood.profile.dto.request.UpdateAddressRequest;
import com.minn.organicfood.profile.dto.response.UserInfo;
import com.minn.organicfood.profile.service.UserProfileService;
import com.minn.organicfood.shared.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;

    @PostMapping("/addresses")
    public String addAddress(@RequestBody @Valid AddUserAddressRequest request) {
        UUID userId = UUID.fromString(SecurityUtils.getCurrentUserId());
        userProfileService.addAddress(userId, request);

        return "Address added successfully";
    }

    @DeleteMapping("/addresses/{addressId}")
    public String deleteAddress(@PathVariable Long addressId) {
        userProfileService.deleteAddress(addressId);
        return "Address deleted successfully";
    }

    @PutMapping("/addresses/{addressId}")
    public String updateAddress(@PathVariable Long addressId, @RequestBody @Valid UpdateAddressRequest request) {
        userProfileService.updateAddress(UUID.fromString(SecurityUtils.getCurrentUserId()), addressId, request);
        return "Address updated successfully";
    }

    @GetMapping("/my-info")
    public UserInfo getInfo() {
        try {
            UUID id = UUID.fromString(SecurityUtils.getCurrentUserId());
            return userProfileService.getInfo(id);
        } catch (InvalidUuidException e) {
            return null;
        }
    }
}
