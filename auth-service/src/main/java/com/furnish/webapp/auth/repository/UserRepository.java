package com.furnish.webapp.auth.repository;

import com.furnish.webapp.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity
 * Provides CRUD operations and custom queries for user management
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);

    /**
     * Check if email already exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if username already exists
     */
    boolean existsByUsername(String username);

    /**
     * Find active user by email
     */
    @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.isActive = true")
    Optional<User> findActiveUserByEmail(String email);

    /**
     * Find active user by username
     */
    @Query("SELECT u FROM User u WHERE u.username = ?1 AND u.isActive = true")
    Optional<User> findActiveUserByUsername(String username);

    /**
     * Check if user exists by email or username
     */
    boolean existsByEmailOrUsername(String email, String username);
}