package com.karthickcloths.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Value("${app.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${app.mail.port:587}")
    private int mailPort;

    @Value("${app.mail.username:trialbytshirt@gmail.com}")
    private String mailUsername;

    @Value("${app.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.smtp.auth:true}")
    private boolean smtpAuth;

    @Value("${app.mail.smtp.starttls.enable:true}")
    private boolean smtpStartTlsEnable;

    @Value("${app.mail.smtp.connectiontimeout:5000}")
    private String connectionTimeout;

    @Value("${app.mail.smtp.timeout:5000}")
    private String timeout;

    @Value("${app.mail.smtp.writetimeout:5000}")
    private String writeTimeout;

    @Bean
    public JavaMailSender mailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.smtp.auth", String.valueOf(smtpAuth));
        properties.put("mail.smtp.starttls.enable", String.valueOf(smtpStartTlsEnable));
        properties.put("mail.smtp.starttls.required", "true");
        properties.put("mail.smtp.ssl.protocols", "TLSv1.2");
        properties.put("mail.smtp.connectiontimeout", connectionTimeout);
        properties.put("mail.smtp.timeout", timeout);
        properties.put("mail.smtp.writetimeout", writeTimeout);

        return mailSender;
    }
}
