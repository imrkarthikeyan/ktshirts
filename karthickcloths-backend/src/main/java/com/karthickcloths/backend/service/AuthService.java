package com.karthickcloths.backend.service;

import com.karthickcloths.backend.dto.LoginRequest;
import com.karthickcloths.backend.dto.LoginResponse;
import com.karthickcloths.backend.dto.SignupRequest;
import com.karthickcloths.backend.model.User;
import com.karthickcloths.backend.repository.UserRepository;
import com.karthickcloths.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String signup(SignupRequest signupRequest) throws Exception {
        // Validate passwords match
        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new Exception("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new Exception("Email already registered");
        }

        // Validate input fields
        if (signupRequest.getEmail() == null || signupRequest.getEmail().isEmpty()) {
            throw new Exception("Email is required");
        }
        if (signupRequest.getPassword() == null || signupRequest.getPassword().length() < 6) {
            throw new Exception("Password must be at least 6 characters");
        }
        if (signupRequest.getPhoneNumber() == null || signupRequest.getPhoneNumber().isEmpty()) {
            throw new Exception("Phone number is required");
        }
        if (signupRequest.getAddress() == null || signupRequest.getAddress().isEmpty()) {
            throw new Exception("Address is required");
        }
        if (signupRequest.getPincode() == null || signupRequest.getPincode().isEmpty()) {
            throw new Exception("Pincode is required");
        }

        // Create new user
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFullName(signupRequest.getFullName());
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setAddress(signupRequest.getAddress());
        user.setPincode(signupRequest.getPincode());

        User savedUser = userRepository.save(user);
        return "User registered successfully";
    }

    public LoginResponse login(LoginRequest loginRequest) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty()) {
            throw new Exception("Invalid email or password");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new Exception("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAddress(user.getAddress());
        response.setPincode(user.getPincode());
        response.setUserId(user.getId());

        return response;
    }

    public User getUserById(Long userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
    }

    public User updateUserProfile(Long userId, SignupRequest updateRequest) throws Exception {
        User user = getUserById(userId);

        if (updateRequest.getPhoneNumber() != null && !updateRequest.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        if (updateRequest.getAddress() != null && !updateRequest.getAddress().isEmpty()) {
            user.setAddress(updateRequest.getAddress());
        }
        if (updateRequest.getPincode() != null && !updateRequest.getPincode().isEmpty()) {
            user.setPincode(updateRequest.getPincode());
        }
        if (updateRequest.getFullName() != null && !updateRequest.getFullName().isEmpty()) {
            user.setFullName(updateRequest.getFullName());
        }

        return userRepository.save(user);
    }
}
