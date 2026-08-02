package com.karthickcloths.backend.service;

import com.karthickcloths.backend.dto.LoginRequest;
import com.karthickcloths.backend.dto.LoginResponse;
import com.karthickcloths.backend.dto.SignupRequest;
import com.karthickcloths.backend.model.User;
import com.karthickcloths.backend.repository.UserRepository;
import com.karthickcloths.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.mail.from:}")
    private String fromEmail;

    @Value("${app.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.brevo.api-key:}")
    private String brevoApiKey;

    @Value("${app.mail.resend.api-key:}")
    private String resendApiKey;

    @Value("${app.otp.dev-fallback:false}")
    private boolean allowDevOtpFallback;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Map<String, PendingSignupOtp> pendingSignups = new ConcurrentHashMap<>();

    public String signup(SignupRequest signupRequest) throws Exception {
        validateSignupFields(signupRequest);

        String normalizedEmail = signupRequest.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new Exception("Email already registered");
        }

        if (!normalizedEmail.equals(adminEmail.trim().toLowerCase())) {
            throw new Exception("OTP verification required. Please request OTP first.");
        }

        createUser(signupRequest, true);
        return "Admin registered successfully";
    }

    public String requestSignupOtp(SignupRequest signupRequest) throws Exception {
        validateSignupFields(signupRequest);

        String normalizedEmail = signupRequest.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new Exception("Email already registered");
        }

        if (normalizedEmail.equals(adminEmail.trim().toLowerCase())) {
            createUser(signupRequest, true);
            return "Admin registered successfully";
        }

        String otp = String.format("%06d", (int) (Math.random() * 1_000_000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        pendingSignups.put(normalizedEmail, new PendingSignupOtp(signupRequest, otp, expiresAt));

        return sendOtpEmail(normalizedEmail, otp);
    }

    public String verifySignupOtp(String email, String otp) throws Exception {
        if (email == null || email.trim().isEmpty()) {
            throw new Exception("Email is required");
        }
        if (otp == null || otp.trim().isEmpty()) {
            throw new Exception("OTP is required");
        }

        String normalizedEmail = email.trim().toLowerCase();
        PendingSignupOtp pending = pendingSignups.get(normalizedEmail);

        if (pending == null) {
            throw new Exception("No OTP request found for this email");
        }
        if (pending.expiresAt().isBefore(LocalDateTime.now())) {
            pendingSignups.remove(normalizedEmail);
            throw new Exception("OTP expired. Please request a new OTP");
        }
        if (!pending.otp().equals(otp.trim())) {
            throw new Exception("Invalid OTP");
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            pendingSignups.remove(normalizedEmail);
            throw new Exception("Email already registered");
        }

        createUser(pending.signupRequest(), false);
        pendingSignups.remove(normalizedEmail);
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
        response.setAdmin(user.isAdmin());

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

    private void validateSignupFields(SignupRequest signupRequest) throws Exception {
        if (signupRequest == null) {
            throw new Exception("Signup data is required");
        }
        if (signupRequest.getEmail() == null || signupRequest.getEmail().isBlank()) {
            throw new Exception("Email is required");
        }
        if (!signupRequest.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new Exception("Invalid email format");
        }
        if (signupRequest.getPassword() == null || signupRequest.getPassword().length() < 6) {
            throw new Exception("Password must be at least 6 characters");
        }
        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new Exception("Passwords do not match");
        }
        if (signupRequest.getFullName() == null || signupRequest.getFullName().isBlank()) {
            throw new Exception("Full name is required");
        }
        if (signupRequest.getPhoneNumber() == null || signupRequest.getPhoneNumber().isBlank()) {
            throw new Exception("Phone number is required");
        }
        if (!signupRequest.getPhoneNumber().matches("^[0-9]{10}$")) {
            throw new Exception("Phone number must be 10 digits");
        }
        if (signupRequest.getAddress() == null || signupRequest.getAddress().isBlank()) {
            throw new Exception("Address is required");
        }
        if (signupRequest.getPincode() == null || signupRequest.getPincode().isBlank()) {
            throw new Exception("Pincode is required");
        }
        if (!signupRequest.getPincode().matches("^[0-9]{6}$")) {
            throw new Exception("Pincode must be 6 digits");
        }
    }

    private void createUser(SignupRequest signupRequest, boolean isAdmin) {
        User user = new User();
        user.setEmail(signupRequest.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFullName(signupRequest.getFullName().trim());
        user.setPhoneNumber(signupRequest.getPhoneNumber().trim());
        user.setAddress(signupRequest.getAddress().trim());
        user.setPincode(signupRequest.getPincode().trim());
        user.setAdmin(isAdmin);
        userRepository.save(user);
    }

    private String sendOtpEmail(String email, String otp) throws Exception {
        if (sendViaBrevoApi(email, otp)) {
            return "OTP sent to your email";
        }
        if (sendViaResendApi(email, otp)) {
            return "OTP sent to your email";
        }

        boolean mailConfigured = mailUsername != null && !mailUsername.isBlank() && mailPassword != null && !mailPassword.isBlank();

        if (!mailConfigured) {
            if (allowDevOtpFallback) {
                LOGGER.warn("SMTP/HTTP Mail not configured. Using development OTP fallback for {}. OTP: {}", email, otp);
                return "OTP email is not configured on server. Development OTP: " + otp;
            }
            throw new Exception("Unable to send OTP email. Configure BREVO_API_KEY/RESEND_API_KEY or APP_MAIL_USERNAME/APP_MAIL_PASSWORD.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            }
            message.setTo(email);
            message.setSubject("TRIAL BY TSHIRT - Signup OTP");
            message.setText("Your OTP for signup is: " + otp + "\n\nThis OTP is valid for 10 minutes.");
            mailSender.send(message);
            return "OTP sent to your email";
        } catch (Exception ex) {
            LOGGER.error("SMTP mail send failed for {}: {}", email, ex.getMessage());
            if (allowDevOtpFallback) {
                LOGGER.warn("Email send failed. Using development OTP fallback for {}. OTP: {}", email, otp);
                return "SMTP delivery failed (Render firewall blocks SMTP ports). Development OTP: " + otp;
            }
            throw new Exception("Unable to send OTP email from " + mailUsername + ". Check Gmail App Password / SMTP access. Reason: " + ex.getMessage());
        }
    }

    private boolean sendViaBrevoApi(String email, String otp) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            return false;
        }
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            String senderMail = (fromEmail != null && !fromEmail.isBlank()) ? fromEmail : "trialbytshirt@gmail.com";
            String jsonBody = String.format(
                "{\"sender\":{\"name\":\"TRIAL BY TSHIRT\",\"email\":\"%s\"},\"to\":[{\"email\":\"%s\"}],\"subject\":\"TRIAL BY TSHIRT - Signup OTP\",\"htmlContent\":\"<p>Your OTP for signup is: <strong>%s</strong></p><p>This OTP is valid for 10 minutes.</p>\"}",
                senderMail,
                email,
                otp
            );

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("https://api.brevo.com/v3/smtp/email"))
                .header("accept", "application/json")
                .header("api-key", brevoApiKey.trim())
                .header("content-type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                LOGGER.info("OTP email sent successfully via Brevo HTTP API to {}", email);
                return true;
            } else {
                LOGGER.error("Brevo API returned error status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception ex) {
            LOGGER.error("Failed to send OTP via Brevo API: {}", ex.getMessage());
        }
        return false;
    }

    private boolean sendViaResendApi(String email, String otp) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            return false;
        }
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            String sender = (fromEmail != null && !fromEmail.isBlank()) ? fromEmail : "onboarding@resend.dev";
            String jsonBody = String.format(
                "{\"from\":\"TRIAL BY TSHIRT <%s>\",\"to\":[\"%s\"],\"subject\":\"TRIAL BY TSHIRT - Signup OTP\",\"html\":\"<p>Your OTP for signup is: <strong>%s</strong></p><p>This OTP is valid for 10 minutes.</p>\"}",
                sender,
                email,
                otp
            );

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + resendApiKey.trim())
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                LOGGER.info("OTP email sent successfully via Resend HTTP API to {}", email);
                return true;
            } else {
                LOGGER.error("Resend API returned error status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception ex) {
            LOGGER.error("Failed to send OTP via Resend API: {}", ex.getMessage());
        }
        return false;
    }

    private record PendingSignupOtp(SignupRequest signupRequest, String otp, LocalDateTime expiresAt) {

    }
}
