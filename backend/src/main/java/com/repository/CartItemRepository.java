package com.repository;

import com.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM cart_item WHERE product_model_no NOT IN (SELECT model_no FROM product)", nativeQuery = true)
    void deleteOrphanedItems();
}
