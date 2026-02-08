package com.service;

import com.entity.*;
import com.payload.request.ProductRequest;
import com.payload.response.FeaturedProductResponse;
import com.repository.ProductRepository;
import com.repository.ProductSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired(required = false)
    private ProductSearchRepository productSearchRepository;

    @Autowired
    private com.repository.OrderRepository orderRepository;

    @Autowired
    private com.repository.UserRepository userRepository;

    public List<Product> getRecommendations(Long userId) {
        if (userId == null) {
            // Return all products for anonymous users (for all-products page)
            return productRepository.findAll();
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return productRepository.findAll();
        }

        Order lastOrder = orderRepository.findTopByUserOrderByOrderDateDesc(user);
        if (lastOrder != null && !lastOrder.getItems().isEmpty()) {
            // Get first product from last order
            Product lastProduct = lastOrder.getItems().get(0).getProduct();
            // Get similar products
            List<Product> similar = getSimilarProducts(lastProduct.getModelNo());
            if (similar.isEmpty()) {
                // If elasticsearch returns nothing, try same category db query
                return getProductsByCategory(lastProduct.getCategory()).stream().limit(8).toList();
            }
            return similar;
        }

        // Default to all products if no orders
        return productRepository.findAll();
    }

    @Cacheable(value = "products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Cacheable(value = "product", key = "#modelNo")
    public Product getProductByModelNo(Long modelNo) {
        return productRepository.findById(Objects.requireNonNull(modelNo, "Model No is required"))
                .orElseThrow(() -> new RuntimeException("Product not found with model no: " + modelNo));
    }

    @CacheEvict(value = { "products", "product" }, allEntries = true)
    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        mapRequestToProduct(request, product);
        Product savedProduct = productRepository.save(product);
        syncToElastic(savedProduct);
        return savedProduct;
    }

    @CacheEvict(value = { "products", "product" }, allEntries = true)
    public Product updateProduct(Long modelNo, ProductRequest request) {
        Product product = getProductByModelNo(modelNo);
        mapRequestToProduct(request, product);
        Product savedProduct = productRepository.save(Objects.requireNonNull(product, "Product is required"));
        syncToElastic(savedProduct);
        return savedProduct;
    }

    @CacheEvict(value = { "products", "product" }, allEntries = true)
    public void deleteProduct(Long modelNo) {
        productRepository.deleteById(Objects.requireNonNull(modelNo, "Model No is required"));
        if (productSearchRepository != null) {
            productSearchRepository.deleteById(modelNo);
        }
    }

    /**
     * Get products by category.
     */
    public List<Product> getProductsByCategory(Category category) {
        return productRepository.findAll().stream()
                .filter(p -> p.getCategory() == category)
                .toList();
    }

    /**
     * Get products by category and subcategory (string parameters).
     */
    public List<Product> getProductsByCategoryAndSubCategory(String category, String subCategory) {
        try {
            Category cat = Category.valueOf(category.toUpperCase());
            SubCategory subCat = SubCategory.valueOf(subCategory.toUpperCase());
            return productRepository.findAll().stream()
                    .filter(p -> p.getCategory() == cat && p.getSubCategory() == subCat)
                    .toList();
        } catch (IllegalArgumentException e) {
            return List.of(); // Return empty list if category/subcategory is invalid
        }
    }

    /**
     * Get products by subcategory.
     */
    public List<Product> getProductsBySubCategory(SubCategory subCategory) {
        return productRepository.findAll().stream()
                .filter(p -> p.getSubCategory() == subCategory)
                .toList();
    }

    /**
     * Count total products.
     */
    public long getTotalProductCount() {
        return productRepository.count();
    }

    /**
     * Count products by category.
     */
    public long countProductsByCategory(Category category) {
        return productRepository.findAll().stream()
                .filter(p -> p.getCategory() == category)
                .count();
    }

    /**
     * Search products by name (case-insensitive) using Elasticsearch.
     */
    public List<Product> searchProducts(String query) {
        if (productSearchRepository == null) {
            return productRepository.searchFallback(query);
        }
        try {
            List<ProductDocument> docs = productSearchRepository.findByNameContainingOrDescriptionContaining(query,
                    query);
            List<Long> ids = docs.stream().map(ProductDocument::getId).collect(Collectors.toList());
            if (ids.isEmpty()) {
                return productRepository.searchFallback(query);
            }
            return productRepository.findAllById(ids);
        } catch (Exception e) {
            System.err.println("Elasticsearch failed, falling back to DB: " + e.getMessage());
            return productRepository.searchFallback(query);
        }
    }

    /**
     * Get similar products based on category using Elasticsearch.
     */
    public List<Product> getSimilarProducts(Long modelNo) {
        Product sourceProduct = getProductByModelNo(modelNo);
        String category = sourceProduct.getCategory() != null ? sourceProduct.getCategory().name() : "";

        if (productSearchRepository == null) {
            return List.of();
        }

        // Find products in same category, excluding current one
        List<ProductDocument> docs = productSearchRepository.findByCategoryAndIdNot(category, modelNo);

        // Limit to 4 recommendations
        List<Long> ids = docs.stream()
                .limit(4)
                .map(ProductDocument::getId)
                .collect(Collectors.toList());

        return productRepository.findAllById(ids);
    }

    @Transactional(readOnly = true)
    public List<FeaturedProductResponse> getFeaturedProducts() {
        List<FeaturedProductResponse> featured = new ArrayList<>();

        addFeatured(featured, Category.MEN);
        addFeatured(featured, Category.WOMEN);
        addFeatured(featured, Category.KIDS);

        return featured;
    }

    private void addFeatured(List<FeaturedProductResponse> list, Category category) {
        Product p = productRepository.findTopByCategoryOrderByModelNoDesc(category);
        if (p != null) {
            FeaturedProductResponse dto = new FeaturedProductResponse();
            dto.setModelNo(p.getModelNo());
            dto.setName(p.getName());
            dto.setPrice(p.getPrice());
            dto.setCategory(p.getCategory().name());
            dto.setImg1(p.getImg1());
            list.add(dto);
        }
    }

    private void syncToElastic(Product product) {
        if (productSearchRepository == null)
            return;
        try {
            ProductDocument doc = new ProductDocument(
                    product.getModelNo(),
                    product.getName(),
                    product.getDescription(),
                    product.getCategory() != null ? product.getCategory().name() : null,
                    product.getSubCategory() != null ? product.getSubCategory().name() : null,
                    product.getPrice(),
                    (product.getImages() != null && !product.getImages().isEmpty())
                            ? product.getImages().get(0).getImageUrl()
                            : null);
            productSearchRepository.save(doc);
        } catch (Exception e) {
            System.err.println("Failed to sync product to Elasticsearch: " + e.getMessage());
        }
    }

    private void mapRequestToProduct(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setColor(request.getColor());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());
        product.setSubCategory(request.getSubCategory());
        product.setDescription(request.getDescription());
        product.setImg1(request.getImg1());
        product.setImg2(request.getImg2());
        product.setImg3(request.getImg3());
        product.setImg4(request.getImg4());
        product.setImg5(request.getImg5());

        // Sync with dynamic Image list
        product.getImages().clear();
        addImgIfNotEmpty(request.getImg1(), product);
        addImgIfNotEmpty(request.getImg2(), product);
        addImgIfNotEmpty(request.getImg3(), product);
        addImgIfNotEmpty(request.getImg4(), product);
        addImgIfNotEmpty(request.getImg4(), product);
        addImgIfNotEmpty(request.getImg5(), product);

        product.setSalePrice(request.getSalePrice());
        product.setSaleEndTime(request.getSaleEndTime());
    }

    public List<Product> getFlashSaleProducts() {
        return productRepository.findBySaleEndTimeAfter(java.time.LocalDateTime.now());
    }

    @CacheEvict(value = { "products", "product" }, allEntries = true)
    public Product updateProductFields(Product product) {
        Product savedProduct = productRepository.save(Objects.requireNonNull(product, "Product is required"));
        syncToElastic(savedProduct);
        return savedProduct;
    }

    private void addImgIfNotEmpty(String url, Product product) {
        if (url != null && !url.trim().isEmpty()) {
            Image img = new Image();
            img.setImageUrl(url);
            img.setProduct(product);
            product.getImages().add(img);
        }
    }
}
