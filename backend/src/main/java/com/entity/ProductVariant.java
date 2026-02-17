package com.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "model_no", "color", "size" })
})
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_no", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(nullable = false)
    private String color;

    @Column(length = 10)
    private String colorHex;

    @Column(nullable = false)
    private String size;

    @Column(length = 255)
    private String styleCode;

    @Column(length = 255)
    private String sku;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantity;

    private Double salePrice;
    private java.time.LocalDateTime saleEndTime;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProductImage> images = new ArrayList<>();
}
