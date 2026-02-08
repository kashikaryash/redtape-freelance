package com.payload.request;

import lombok.Data;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String paymentMethod;
    private Double discount;
}
