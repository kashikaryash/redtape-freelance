package com.payload.request;

import com.entity.Category;
import com.entity.SubCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    private String color;

    @NotNull
    @PositiveOrZero
    private Double price;

    @NotNull
    @PositiveOrZero
    private Integer quantity;

    private Category category;
    private SubCategory subCategory;
    private String description;
    private String img1;
    private String img2;
    private String img3;
    private String img4;
    private String img5;

    // Flash Sale
    private Double salePrice;
    private java.time.LocalDateTime saleEndTime;
}
