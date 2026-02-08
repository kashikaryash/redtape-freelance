package com.mapper;

import com.dto.AdminOrderDTO;
import com.dto.AdminOrderItemDTO;
import com.dto.OrderResponseDTO;
import com.dto.ProductSummaryDTO;
import com.dto.UserDTO;
import com.entity.Order;
import com.entity.OrderItem;

import java.util.List;

public class OrderMapper {

        public static AdminOrderDTO toAdminDTO(Order order) {

                List<AdminOrderItemDTO> itemDTOs = order.getItems().stream()
                                .map(OrderMapper::toItemDTO)
                                .toList();

                UserDTO userDTO = new UserDTO(
                                order.getUser().getId(),
                                order.getUser().getName(),
                                order.getUser().getEmail(),
                                order.getUser().getProfilePictureType());

                return new AdminOrderDTO(
                                order.getId(),
                                userDTO,
                                itemDTOs,
                                order.getTotalAmount(),
                                order.getStatus().name(),
                                order.getOrderDate());
        }

        public static OrderResponseDTO toResponseDTO(Order order) {
                List<AdminOrderItemDTO> itemDTOs = order.getItems().stream()
                                .map(OrderMapper::toItemDTO)
                                .toList();

                UserDTO userDTO = new UserDTO(
                                order.getUser().getId(),
                                order.getUser().getName(),
                                order.getUser().getEmail(),
                                order.getUser().getProfilePictureType());

                return new OrderResponseDTO(
                                order.getId(),
                                userDTO,
                                itemDTOs,
                                order.getTotalAmount(),
                                order.getStatus().name(),
                                order.getOrderDate());
        }

        private static AdminOrderItemDTO toItemDTO(OrderItem item) {
                ProductSummaryDTO productDTO = new ProductSummaryDTO(
                                item.getProduct().getModelNo(),
                                item.getProduct().getName(),
                                item.getProduct().getImg1());

                return new AdminOrderItemDTO(
                                productDTO,
                                item.getPrice(),
                                item.getQuantity(),
                                item.getPrice() * item.getQuantity());
        }
}
