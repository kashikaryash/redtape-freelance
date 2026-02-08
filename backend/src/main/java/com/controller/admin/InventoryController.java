package com.controller.admin;

import com.entity.Product;
import com.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/inventory")
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    /**
     * Get inventory dashboard summary
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getInventorySummary() {
        List<Product> lowStock = inventoryService.getLowStockProducts();
        List<Product> outOfStock = inventoryService.getOutOfStockProducts();

        Map<String, Object> summary = new HashMap<>();
        summary.put("lowStockCount", lowStock.size());
        summary.put("outOfStockCount", outOfStock.size());
        summary.put("lowStockProducts", lowStock);
        summary.put("outOfStockProducts", outOfStock);

        return ResponseEntity.ok(summary);
    }

    /**
     * Get all low stock products
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(inventoryService.getLowStockProducts());
    }

    /**
     * Get all out of stock products
     */
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<Product>> getOutOfStockProducts() {
        return ResponseEntity.ok(inventoryService.getOutOfStockProducts());
    }

    /**
     * Update stock quantity
     */
    @PutMapping("/{productId}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long productId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(inventoryService.updateStock(productId, quantity));
    }

    /**
     * Update low stock threshold
     */
    @PutMapping("/{productId}/threshold")
    public ResponseEntity<Product> updateThreshold(
            @PathVariable Long productId,
            @RequestParam int threshold) {
        return ResponseEntity.ok(inventoryService.updateLowStockThreshold(productId, threshold));
    }

    /**
     * Bulk update stock
     */
    @PutMapping("/bulk-update")
    public ResponseEntity<Map<String, String>> bulkUpdateStock(@RequestBody List<Map<String, Object>> updates) {
        int successCount = 0;
        int failCount = 0;

        for (Map<String, Object> update : updates) {
            try {
                Long productId = Long.valueOf(update.get("productId").toString());
                int quantity = Integer.parseInt(update.get("quantity").toString());
                inventoryService.updateStock(productId, quantity);
                successCount++;
            } catch (Exception e) {
                failCount++;
            }
        }

        Map<String, String> result = new HashMap<>();
        result.put("message", String.format("Updated %d products, %d failed", successCount, failCount));
        return ResponseEntity.ok(result);
    }
}
