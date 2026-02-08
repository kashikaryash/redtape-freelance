package com.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Moderator Entity
 * =================
 * 
 * Represents extended moderator capabilities beyond the basic MODERATOR role.
 * Allows granular permission control and category assignments for moderators.
 * 
 * <p>
 * A user with role MODERATOR should have a corresponding Moderator record
 * that defines their specific permissions and scope of authority.
 * </p>
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "moderators")
public class Moderator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Reference to the User entity.
     * Each moderator is linked to exactly one user account.
     */
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /**
     * Categories this moderator is responsible for.
     * Determines which product categories they can manage.
     */
    @ElementCollection(targetClass = Category.class)
    @CollectionTable(name = "moderator_categories", joinColumns = @JoinColumn(name = "moderator_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Set<Category> categories = new HashSet<>();

    // ==================== PERMISSIONS ====================

    /**
     * Permission to delete user reviews.
     */
    @Column(nullable = false)
    private Boolean canDeleteReviews = false;

    /**
     * Permission to ban/suspend users.
     */
    @Column(nullable = false)
    private Boolean canBanUsers = false;

    /**
     * Permission to edit product listings.
     */
    @Column(nullable = false)
    private Boolean canEditProducts = false;

    /**
     * Permission to manage order disputes.
     */
    @Column(nullable = false)
    private Boolean canManageOrders = false;

    // ==================== METADATA ====================

    /**
     * Authority level (1-5).
     * Higher levels may override decisions of lower levels.
     */
    @Column(nullable = false)
    private Integer moderationLevel = 1;

    /**
     * Timestamp when this user was assigned as moderator.
     */
    @Column(nullable = false)
    private LocalDateTime assignedAt;

    /**
     * ID of the admin who assigned this moderator.
     */
    @Column
    private Long assignedBy;

    /**
     * Whether this moderator is currently active.
     * Inactive moderators retain their data but cannot perform actions.
     */
    @Column(nullable = false)
    private Boolean isActive = true;

    /**
     * Admin notes about this moderator.
     */
    @Column(length = 500)
    private String notes;

    /**
     * Set assignment timestamp before persisting.
     */
    @PrePersist
    public void onCreate() {
        this.assignedAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
    }
}
