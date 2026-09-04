package com.minn.organicfood.identity.domain;

import com.github.f4b6a3.uuid.UuidCreator;
import com.minn.organicfood.identity.domain.enums.AccountStatus;
import com.minn.organicfood.shared.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(
        name = "accounts",
        schema = "identity"
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Account extends AuditableEntity<UUID> {

    @Id
    private UUID id;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    String email;

    @Column(name = "password", nullable = false, length = 100)
    String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    AccountStatus status = AccountStatus.INACTIVE;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "deleted_by", length = 100)
    private String deletedBy;

    @OneToMany(
            mappedBy = "account",
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
            orphanRemoval = true
    )
    @Setter(AccessLevel.PRIVATE)
    @Builder.Default
    private Set<AccountRole> accountRoles = new HashSet<>();

    @PrePersist
    void prePersist() {
        if (id == null)
            this.id = UuidCreator.getTimeOrderedEpoch();
    }

    public AccountRole addRole(Role role) {
        AccountRole accountRole = AccountRole.builder()
                .account(this)
                .role(role)
                .build();
        this.accountRoles.add(accountRole);

        return accountRole;
    }

    public void removeRole(Role role) {
        this.accountRoles.removeIf(accountRole -> accountRole.getRole().equals(role));
    }

    public Set<Role> getRoles() {
        return accountRoles.stream()
                .map(AccountRole::getRole)
                .collect(Collectors.toUnmodifiableSet());
    }
}
