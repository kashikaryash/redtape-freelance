package com.repository;

import com.entity.Product;
import com.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);

    List<Product> findByNameContainingIgnoreCase(String name);

    long countByCategory(Category category);

    // Fallback search using DB
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchFallback(String query);

    // Fetch one product per category (e.g. latest or high rated)
    Product findTopByCategoryOrderByModelNoDesc(Category category);

    // Flash Sales
    List<Product> findBySaleEndTimeAfter(java.time.LocalDateTime now);
}
