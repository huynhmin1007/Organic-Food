package com.minn.organicfood.profile.service;

import com.minn.organicfood.profile.domain.UserAddress;
import com.minn.organicfood.profile.domain.UserProfile;
import com.minn.organicfood.profile.dto.request.AddUserAddressRequest;
import com.minn.organicfood.profile.dto.request.CreateUserProfileRequest;
import com.minn.organicfood.profile.dto.request.UpdateAddressRequest;
import com.minn.organicfood.profile.dto.response.UserInfo;
import com.minn.organicfood.profile.mapper.UserProfileMapper;
import com.minn.organicfood.profile.repository.UserAddressRepository;
import com.minn.organicfood.profile.repository.UserProfileRepository;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserProfileService {

    private final UserProfileRepository profileRepository;
    private final UserAddressRepository addressRepository;
    private final UserProfileMapper mapper;

    private final ApplicationEventPublisher publisher;

    @Transactional
    public void createProfile(CreateUserProfileRequest request) {
        profileRepository.save(mapper.toEntity(request));
    }

    public UserInfo getInfo(UUID accountId) {
        UserProfile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> BusinessException.of(ErrorCode.ACCOUNT_NOT_FOUND));

        return mapper.toResponse(profile);
    }

    @Transactional
    public void addAddress(UUID accountId, AddUserAddressRequest request) {
        UserProfile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> BusinessException.of(ErrorCode.ACCOUNT_NOT_FOUND));

        UserAddress newAddress = UserAddress.builder()
                .address(request.getAddress())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .build();

        profile.getAddresses().forEach(address -> {
            if (address.getAddress().equals(newAddress.getAddress())) {
                throw BusinessException.of(ErrorCode.ADDRESS_ALREADY_EXISTS);
            }

            if (newAddress.isDefault()) {
                address.setDefault(false);
            }
        });

        newAddress.setUserProfile(profile);
        profile.getAddresses().add(newAddress);

        profileRepository.save(profile);
    }

    @Transactional
    public void deleteAddress(Long addressId) {
        addressRepository.deleteById(addressId);
    }

    @Transactional
    public void updateAddress(UUID accountId, Long addressId, UpdateAddressRequest request) {

        UserProfile profile = profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> BusinessException.of(ErrorCode.ACCOUNT_NOT_FOUND));

        UserAddress address = profile.getAddresses().stream()
                .filter(a -> a.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> BusinessException.of(ErrorCode.ADDRESS_NOT_FOUND));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            profile.getAddresses()
                    .forEach(a -> a.setDefault(false));
        }

        address.setAddress(request.getAddress());
        address.setDefault(Boolean.TRUE.equals(request.getIsDefault()));
    }
}
