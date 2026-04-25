package com.karthickcloths.backend.repository;

import com.karthickcloths.backend.model.CustomTshirtRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomTshirtRequestRepository extends JpaRepository<CustomTshirtRequest, Long> {

    Optional<CustomTshirtRequest> findByOrderId(String orderId);

    Optional<CustomTshirtRequest> findByOrderIdAndUserEmailIgnoreCase(String orderId, String userEmail);

    List<CustomTshirtRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<CustomTshirtRequest> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail);

    List<CustomTshirtRequest> findAllByOrderByCreatedAtDesc();

    List<CustomTshirtRequest> findByStatusOrderByCreatedAtDesc(String status);
}
