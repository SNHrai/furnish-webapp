package com.furnish.webapp.quotationservice.repository;

import com.furnish.webapp.quotationservice.entity.Quotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, String> {
    
    /**
     * Find all quotations for a specific user
     */
    List<Quotation> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Find quotations by user ID with pagination
     */
    Page<Quotation> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    /**
     * Find quotation by ID and user ID (security check)
     */
    Optional<Quotation> findByIdAndUserId(String id, String userId);
    
    /**
     * Find quotations by status
     */
    List<Quotation> findByStatusOrderByCreatedAtDesc(Quotation.QuotationStatus status);
    
    /**
     * Find quotations by user ID and status
     */
    List<Quotation> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, Quotation.QuotationStatus status);
    
    /**
     * Count quotations by user ID
     */
    long countByUserId(String userId);
    
    /**
     * Find quotations created within a date range
     */
    @Query("SELECT q FROM Quotation q WHERE q.createdAt BETWEEN :startDate AND :endDate ORDER BY q.createdAt DESC")
    List<Quotation> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find quotations by user ID and name containing (for search)
     */
    List<Quotation> findByUserIdAndNameContainingIgnoreCaseOrderByCreatedAtDesc(String userId, String nameSearch);
    
    /**
     * Check if user has existing quotations
     */
    boolean existsByUserId(String userId);
}