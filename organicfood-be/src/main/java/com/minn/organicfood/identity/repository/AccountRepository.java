package com.minn.organicfood.identity.repository;

import com.minn.organicfood.identity.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    boolean existsByEmail(String email);
    Optional<Account> findByEmail(String email);

    @Query("""
                select a.email
                from Account a
                where a.id = :id
            """)
    String findEmailById(UUID id);
}
