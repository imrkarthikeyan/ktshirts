package com.karthickcloths.backend.repository;

import com.karthickcloths.backend.model.SiteContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {

    Optional<SiteContent> findByContentKey(String contentKey);
}
