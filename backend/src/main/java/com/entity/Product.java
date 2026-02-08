package com.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class Product implements java.io.Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ✅ safer than AUTO
    private long modelNo;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 30)
    private String color;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantity;

    // Flash Sale Fields
    private Double salePrice;
    private java.time.LocalDateTime saleEndTime;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private SubCategory subCategory;

    @Column(length = 255)
    private String description;

    /*
     * =======================
     * IMAGE DATA (LAZY)
     * =======================
     */

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] image1Data;

    private String image1Type;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] image2Data;

    private String image2Type;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] image3Data;

    private String image3Type;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] image4Data;

    private String image4Type;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] image5Data;

    private String image5Type;

    /*
     * =======================
     * OLD IMAGE URLS
     * =======================
     */

    @Column(length = 900)
    private String img1;
    @Column(length = 900)
    private String img2;
    @Column(length = 900)
    private String img3;
    @Column(length = 900)
    private String img4;
    @Column(length = 900)
    private String img5;

    /*
     * =======================
     * RELATIONSHIPS (LAZY + IGNORE)
     * =======================
     */

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private transient List<Image> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private transient List<UserReview> reviews = new ArrayList<>();

    // 🚨 VERY IMPORTANT — BREAK CART & ORDER LOOPS
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonIgnore
    private transient List<CartItem> cartItems;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonIgnore
    private transient List<OrderItem> orderItems;

    /*
     * =======================
     * META
     * =======================
     */

    @Column(nullable = false)
    private double averageRating = 0.0;

    @Column(nullable = false)
    private int lowStockThreshold = 5;

    @Column(nullable = false)
    private int reviewCount = 0;

    /*
     * =======================
     * HELPERS
     * =======================
     */

    public boolean hasImage(int num) {
        return getImageData(num) != null && getImageData(num).length > 0;
    }

    public byte[] getImageData(int num) {
        return switch (num) {
            case 1 -> image1Data;
            case 2 -> image2Data;
            case 3 -> image3Data;
            case 4 -> image4Data;
            case 5 -> image5Data;
            default -> null;
        };
    }

    public String getImageType(int num) {
        return switch (num) {
            case 1 -> image1Type;
            case 2 -> image2Type;
            case 3 -> image3Type;
            case 4 -> image4Type;
            case 5 -> image5Type;
            default -> null;
        };
    }
}
