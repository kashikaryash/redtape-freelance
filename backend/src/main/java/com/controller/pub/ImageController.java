package com.controller.pub;

import com.entity.Product;
import com.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ProductService productService;

    /**
     * Serve product image by modelNo and image number (1-5)
     */
    @GetMapping("/product/{modelNo}/{imageNum}")
    public ResponseEntity<byte[]> getProductImage(
            @PathVariable Long modelNo,
            @PathVariable int imageNum) {

        if (imageNum < 1 || imageNum > 5) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Product product = productService.getProductByModelNo(modelNo);

            if (product == null || !product.hasImage(imageNum)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageData = product.getImageData(imageNum);
            String contentType = product.getImageType(imageNum);

            if (imageData == null || imageData.length == 0) {
                return ResponseEntity.notFound().build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    contentType != null ? contentType : "image/jpeg"));
            headers.setContentLength(imageData.length);
            headers.setCacheControl("public, max-age=86400"); // Cache for 1 day

            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
