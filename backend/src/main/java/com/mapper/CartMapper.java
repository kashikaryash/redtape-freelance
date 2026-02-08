package com.mapper;

import com.dto.CartItemDTO;
import com.dto.ProductSummaryDTO;
import com.entity.Cart;
import com.entity.CartItem;
import com.payload.response.CartResponseDTO;

import java.util.List;

public class CartMapper {

    public static CartResponseDTO toDTO(Cart cart) {

        List<CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(CartMapper::toItemDTO)
                .toList();

        return new CartResponseDTO(
                cart.getId(),
                itemDTOs,
                cart.getTotalAmount());
    }

    private static CartItemDTO toItemDTO(CartItem item) {
        ProductSummaryDTO productDTO = new ProductSummaryDTO(
                item.getProduct().getModelNo(),
                item.getProduct().getName(),
                item.getProduct().getImg1());

        return new CartItemDTO(
                item.getId(),
                productDTO,
                item.getPrice(),
                item.getQuantity(),
                item.getPrice() * item.getQuantity());
    }
}
