package com.minn.organicfood.identity.service;

import com.minn.organicfood.identity.domain.Role;
import com.minn.organicfood.identity.repository.RoleRepository;
import com.minn.organicfood.shared.exception.BaseErrorCode;
import com.minn.organicfood.shared.exception.BusinessException;
import com.minn.organicfood.shared.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {

    RoleRepository roleRepository;

    protected Role findByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> BusinessException.of(ErrorCode.ROLE_NOT_FOUND));
    }
}
