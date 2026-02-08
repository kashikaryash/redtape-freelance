package com.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private Long id;
    private ProductSummaryDTO product;
    private double productPrice;
    private int quantity;
    private double itemTotal;
}
