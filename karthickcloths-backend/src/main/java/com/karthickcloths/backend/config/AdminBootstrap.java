package com.karthickcloths.backend.config;

import com.karthickcloths.backend.model.User;
import com.karthickcloths.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.full-name}")
    private String adminFullName;

    public AdminBootstrap(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void ensureAdminAccount() {
        User adminUser = userRepository.findByEmail(adminEmail).orElseGet(User::new);

        adminUser.setEmail(adminEmail);
        adminUser.setPassword(passwordEncoder.encode(adminPassword));
        adminUser.setFullName(adminFullName);
        adminUser.setPhoneNumber(adminUser.getPhoneNumber() != null ? adminUser.getPhoneNumber() : "0000000000");
        adminUser.setAddress(adminUser.getAddress() != null ? adminUser.getAddress() : "Admin dashboard access");
        adminUser.setPincode(adminUser.getPincode() != null ? adminUser.getPincode() : "000000");
        adminUser.setAdmin(true);

        userRepository.save(adminUser);
    }
}
