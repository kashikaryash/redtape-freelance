package com.controller.admin;

import com.entity.Category;
import com.entity.Product;
import com.entity.SubCategory;
import com.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
public class AdminProductController {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Create product with image uploads
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Product> createProduct(
            @RequestParam String name,
            @RequestParam String color,
            @RequestParam double price,
            @RequestParam int quantity,
            @RequestParam String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String description,
            @RequestPart(required = false) MultipartFile image1,
            @RequestPart(required = false) MultipartFile image2,
            @RequestPart(required = false) MultipartFile image3,
            @RequestPart(required = false) MultipartFile image4,
            @RequestPart(required = false) MultipartFile image5) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setColor(color);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setCategory(Category.valueOf(category.toUpperCase()));
        if (subCategory != null && !subCategory.isEmpty()) {
            product.setSubCategory(SubCategory.valueOf(subCategory.toUpperCase()));
        }
        product.setDescription(description);

        // Store images as binary
        if (image1 != null && !image1.isEmpty()) {
            product.setImage1Data(image1.getBytes());
            product.setImage1Type(image1.getContentType());
        }
        if (image2 != null && !image2.isEmpty()) {
            product.setImage2Data(image2.getBytes());
            product.setImage2Type(image2.getContentType());
        }
        if (image3 != null && !image3.isEmpty()) {
            product.setImage3Data(image3.getBytes());
            product.setImage3Type(image3.getContentType());
        }
        if (image4 != null && !image4.isEmpty()) {
            product.setImage4Data(image4.getBytes());
            product.setImage4Type(image4.getContentType());
        }
        if (image5 != null && !image5.isEmpty()) {
            product.setImage5Data(image5.getBytes());
            product.setImage5Type(image5.getContentType());
        }

        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    /**
     * Update product with optional image uploads
     */
    @PutMapping(value = "/{modelNo}", consumes = "multipart/form-data")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long modelNo,
            @RequestParam String name,
            @RequestParam String color,
            @RequestParam double price,
            @RequestParam int quantity,
            @RequestParam String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String description,
            @RequestPart(required = false) MultipartFile image1,
            @RequestPart(required = false) MultipartFile image2,
            @RequestPart(required = false) MultipartFile image3,
            @RequestPart(required = false) MultipartFile image4,
            @RequestPart(required = false) MultipartFile image5) throws IOException {

        Product product = productRepository.findById(
                Objects.requireNonNull(modelNo, "Model No is required"))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(name);
        product.setColor(color);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setCategory(Category.valueOf(category.toUpperCase()));
        if (subCategory != null && !subCategory.isEmpty()) {
            product.setSubCategory(SubCategory.valueOf(subCategory.toUpperCase()));
        }
        product.setDescription(description);

        // Update images only if new ones are provided
        if (image1 != null && !image1.isEmpty()) {
            product.setImage1Data(image1.getBytes());
            product.setImage1Type(image1.getContentType());
        }
        if (image2 != null && !image2.isEmpty()) {
            product.setImage2Data(image2.getBytes());
            product.setImage2Type(image2.getContentType());
        }
        if (image3 != null && !image3.isEmpty()) {
            product.setImage3Data(image3.getBytes());
            product.setImage3Type(image3.getContentType());
        }
        if (image4 != null && !image4.isEmpty()) {
            product.setImage4Data(image4.getBytes());
            product.setImage4Type(image4.getContentType());
        }
        if (image5 != null && !image5.isEmpty()) {
            product.setImage5Data(image5.getBytes());
            product.setImage5Type(image5.getContentType());
        }

        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }
}
