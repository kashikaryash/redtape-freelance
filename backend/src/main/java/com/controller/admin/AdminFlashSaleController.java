package com.controller.admin;

import com.entity.Product;
import com.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/flash-sales")
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
public class AdminFlashSaleController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getActiveFlashSales() {
        return ResponseEntity.ok(productService.getFlashSaleProducts());
    }

    @PostMapping("/{modelNo}")
    public ResponseEntity<Product> setFlashSale(
            @PathVariable Long modelNo,
            @RequestBody Map<String, Object> request) {

        Double salePrice = Double.valueOf(request.get("salePrice").toString());
        String endTimeStr = request.get("saleEndTime").toString();
        LocalDateTime endTime = LocalDateTime.parse(endTimeStr);

        Product product = productService.getProductByModelNo(modelNo);
        product.setSalePrice(salePrice);
        product.setSaleEndTime(endTime);

        // We reuse the update logic or specifically save it
        return ResponseEntity.ok(productService.updateProductFields(product));
    }

    @DeleteMapping("/{modelNo}")
    public ResponseEntity<Product> removeFlashSale(@PathVariable Long modelNo) {
        Product product = productService.getProductByModelNo(modelNo);
        product.setSalePrice(null);
        product.setSaleEndTime(null);
        return ResponseEntity.ok(productService.updateProductFields(product));
    }
}
