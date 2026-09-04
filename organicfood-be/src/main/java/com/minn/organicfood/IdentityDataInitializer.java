package com.minn.organicfood;

import com.minn.organicfood.identity.domain.Account;
import com.minn.organicfood.identity.domain.Permission;
import com.minn.organicfood.identity.domain.Role;
import com.minn.organicfood.identity.domain.enums.AccountStatus;
import com.minn.organicfood.identity.repository.AccountRepository;
import com.minn.organicfood.identity.repository.PermissionRepository;
import com.minn.organicfood.identity.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class IdentityDataInitializer {

    AccountRepository accountRepository;
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    PasswordEncoder passwordEncoder;

    static final int TOTAL_ACCOUNTS = 10_000;

    @Transactional
    public void init() {
        if (accountRepository.count() > 0)
            return;

        log.info("[Identity] Seeding permissions...");
        List<Permission> permissions = seedPermissions();

        log.info("[Identity] Seeding roles...");
        List<Role> roles = seedRoles(permissions);

        log.info("[Identity] Seeding accounts...");
        seedAccounts(roles);
    }

    private List<Permission> seedPermissions() {
        List<Permission> permissions = List.of(
                // Product
                buildPermission("PRODUCT_VIEW", "Xem sản phẩm"),
                buildPermission("PRODUCT_CREATE", "Tạo sản phẩm"),
                buildPermission("PRODUCT_UPDATE", "Cập nhật sản phẩm"),
                buildPermission("PRODUCT_DELETE", "Xóa sản phẩm"),
                // User
                buildPermission("USER_VIEW", "Xem người dùng"),
                buildPermission("USER_CREATE", "Tạo người dùng"),
                buildPermission("USER_UPDATE", "Cập nhật người dùng"),
                buildPermission("USER_DELETE", "Xóa người dùng")
        );
        return permissionRepository.saveAll(permissions);
    }

    private List<Role> seedRoles(List<Permission> permissions) {
        Map<String, Permission> permMap = permissions.stream()
                .collect(Collectors.toMap(Permission::getName, p -> p));

        Role admin = buildRole("ADMIN");
        assignPermissionsToRole(admin, permissions);

        Role productManager = buildRole("PRODUCT_MANAGER");
        assignPermissionsToRole(productManager, List.of(
                permMap.get("PRODUCT_VIEW"),
                permMap.get("PRODUCT_CREATE"),
                permMap.get("PRODUCT_UPDATE"),
                permMap.get("PRODUCT_DELETE"),
                permMap.get("USER_VIEW")
        ));

        Role customer = buildRole("CUSTOMER");
        assignPermissionsToRole(customer, List.of(
                permMap.get("PRODUCT_VIEW")
        ));

        return roleRepository.saveAll(List.of(admin, productManager, customer));
    }

    private void seedAccounts(List<Role> roles) {
        Map<String, Role> roleMap = roles.stream().collect(Collectors.toMap(Role::getName, r -> r));

        Faker faker = new Faker(new Locale("vi"));
        String password = passwordEncoder.encode("Password123@");

        Role adminRole = roleMap.get("ADMIN");
        Role productManagerRole = roleMap.get("PRODUCT_MANAGER");
        Role customerRole = roleMap.get("CUSTOMER");

        // 1 admin
        Account admin = buildAccount("admin@organicfood.vn", password, "Admin");
        assignRolesToAccount(admin, List.of(adminRole));
        accountRepository.save(admin);

        // 9 manager
        for (int i = 0; i < 9; i++) {
            Account manager = buildAccount(
                    "manager" + i + "@organicfood.vn", password, faker.name().fullName());
            assignRolesToAccount(manager, List.of(productManagerRole));
            accountRepository.save(manager);
        }

        //  customers — batch insert
//        List<Account> customers = new ArrayList<>();
//
//        for (int i = 0; i < 90; i++) {
//            String fullName = faker.name().fullName();
//
//            customers.add(buildAccount(
//                    generateEmail(fullName, i),
//                    password,
//                    fullName
//            ));
//
//            if (customers.size() == 500) {
//                List<Account> saved = accountRepository.saveAll(customers);
//                saved.forEach(account -> assignRolesToAccount(account, List.of(customerRole)));
//                customers.clear();
//            }
//        }
//
//        if (!customers.isEmpty()) {
//            List<Account> saved = accountRepository.saveAll(customers);
//            saved.forEach(a -> assignRolesToAccount(a, List.of(customerRole)));
//        }
    }

    private static final List<String> EMAIL_DOMAINS = List.of(
            "gmail.com", "yahoo.com", "outlook.com", "hotmail.com"
    );

    // Tách first name và last name riêng, bỏ dấu, ghép lại
    private String generateEmail(String fullName, int index) {
        String normalized = Normalizer.normalize(fullName, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "") // bỏ dấu
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "") // bỏ ký tự đặc biệt
                .trim();

        String[] parts = normalized.split("\\s+");
        String firstName = parts[parts.length - 1]; // tiếng Việt: tên ở cuối
        String lastName = parts[0]; // họ ở đầu

        String domain = EMAIL_DOMAINS.get(index % EMAIL_DOMAINS.size());

        // Kết hợp tên + họ viết tắt + index nhỏ
        return firstName + "." + lastName.charAt(0) + index + "@" + domain;
    }

    private Permission buildPermission(String name, String description) {
        return Permission.builder()
                .name(name)
                .description(description)
                .build();
    }

    private Role buildRole(String name) {
        return Role.builder()
                .name(name)
                .build();
    }

    private void assignPermissionsToRole(Role role, List<Permission> permissions) {
        permissions.stream().forEach(permission -> role.addPermission(permission));
    }

    private Account buildAccount(String email, String password, String fullName) {
        return Account.builder()
                .email(email)
                .password(password)
                .status(AccountStatus.ACTIVE)
                .build();
    }

    private void assignRolesToAccount(Account account, List<Role> roles) {
        roles.stream().forEach(role -> account.addRole(role));
    }
}