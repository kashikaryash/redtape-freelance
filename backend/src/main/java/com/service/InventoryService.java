package com.service;

import com.entity.Product;
import com.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Check if enough stock is available for a product
     */
    public boolean checkStockAvailability(Long productId, int requestedQuantity) {
        Product product = productRepository.findById(Objects.requireNonNull(productId, "Product ID is required"))
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return product.getQuantity() >= requestedQuantity;
    }

    /**
     * Reduce stock after a successful order
     */
    @Transactional
    public void reduceStock(Long productId, int quantity) {
        Product product = productRepository.findById(Objects.requireNonNull(productId, "Product ID is required"))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }

        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }

    /**
     * Restore stock on order cancellation
     */
    @Transactional
    public void restoreStock(Long productId, int quantity) {
        Product product = productRepository.findById(Objects.requireNonNull(productId, "Product ID is required"))
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setQuantity(product.getQuantity() + quantity);
        productRepository.save(product);
    }

    /**
     * Get all products with low stock
     */
    public List<Product> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getQuantity() <= p.getLowStockThreshold() && p.getQuantity() > 0)
                .collect(Collectors.toList());
    }

    /**
     * Get all out-of-stock products
     */
    public List<Product> getOutOfStockProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getQuantity() == 0)
                .collect(Collectors.toList());
    }

    /**
     * Update stock quantity for a product
     */
    @Transactional
    public Product updateStock(Long productId, int newQuantity) {
        if (newQuantity < 0) {
            throw new RuntimeException("Stock quantity cannot be negative");
        }

        Product product = productRepository.findById(Objects.requireNonNull(productId, "Product ID is required"))
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setQuantity(newQuantity);
        return productRepository.save(product);
    }

    /**
     * Update low stock threshold for a product
     */
    @Transactional
    public Product updateLowStockThreshold(Long productId, int threshold) {
        if (threshold < 0) {
            throw new RuntimeException("Threshold cannot be negative");
        }

        Product product = productRepository.findById(Objects.requireNonNull(productId, "Product ID is required"))
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setLowStockThreshold(threshold);
        return productRepository.save(product);
    }

    /**
     * Get stock status for a product
     */
    public String getStockStatus(Product product) {
        if (product.getQuantity() == 0) {
            return "OUT_OF_STOCK";
        } else if (product.getQuantity() <= product.getLowStockThreshold()) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }
}
