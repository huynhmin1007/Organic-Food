package com.minn.organicfood.profile.mapper;

import com.minn.organicfood.profile.domain.UserAddress;
import com.minn.organicfood.profile.domain.UserProfile;
import com.minn.organicfood.profile.dto.request.AddUserAddressRequest;
import com.minn.organicfood.profile.dto.request.CreateUserProfileRequest;
import com.minn.organicfood.profile.dto.response.UserAddressResponse;
import com.minn.organicfood.profile.dto.response.UserInfo;
import org.mapstruct.Mapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    UserProfile toEntity(CreateUserProfileRequest request);

    UserInfo toResponse(UserProfile userProfile);
    UserAddressResponse toAddressResponse(UserAddress userAddress);
    List<UserAddressResponse> toAddressResponse(Collection<UserAddress> userAddresses);
}
