package com.controller.pub;

import com.entity.Product;
import com.payload.request.ProductRequest;
import com.payload.response.FeaturedProductResponse;
import com.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS handled globally in SecurityConfig
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @PreAuthorize("permitAll()")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/category/{category}/{subCategory}")
    @PreAuthorize("permitAll()")
    public List<Product> getProductsByCategoryAndSubCategory(
            @PathVariable String category,
            @PathVariable String subCategory) {
        return productService.getProductsByCategoryAndSubCategory(category, subCategory);
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public java.util.List<com.payload.response.ProductSearchResponse> searchProducts(@RequestParam String q) {
        List<Product> products = productService.searchProducts(q);
        return products.stream().map(p -> {
            com.payload.response.ProductSearchResponse dto = new com.payload.response.ProductSearchResponse();
            dto.setModelNo(p.getModelNo());
            dto.setName(p.getName());
            dto.setPrice(p.getPrice());
            dto.setCategory(p.getCategory() != null ? p.getCategory().name() : "");

            if (p.getImage1Data() != null && p.getImage1Data().length > 0) {
                dto.setImage1(java.util.Base64.getEncoder().encodeToString(p.getImage1Data()));
            }
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{modelNo}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Product> getProductByModelNo(@PathVariable Long modelNo) {
        return ResponseEntity.ok(productService.getProductByModelNo(modelNo));
    }

    @GetMapping("/{modelNo}/similar")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Product>> getSimilarProducts(@PathVariable Long modelNo) {
        return ResponseEntity.ok(productService.getSimilarProducts(modelNo));
    }

    @GetMapping("/featured")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<FeaturedProductResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/flash-sale")
    public ResponseEntity<List<Product>> getFlashSaleProducts() {
        return ResponseEntity.ok(productService.getFlashSaleProducts());
    }

    @GetMapping("/recommendations")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<Product>> getRecommendations() {
        Long userId = null;
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof com.service.UserDetailsImpl) {
                userId = ((com.service.UserDetailsImpl) auth.getPrincipal()).getId();
            }
        } catch (Exception e) {
            // ignore, assume anonymous
        }
        return ResponseEntity.ok(productService.getRecommendations(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(productService.createProduct(productRequest));
    }

    @PutMapping("/{modelNo}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long modelNo,
            @Valid @RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(productService.updateProduct(modelNo, productRequest));
    }

    @DeleteMapping("/{modelNo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long modelNo) {
        productService.deleteProduct(modelNo);
        return ResponseEntity.ok().build();
    }
}
