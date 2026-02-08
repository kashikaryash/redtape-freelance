package com.service;

import com.dto.AdminOrderDTO;
import com.dto.OrderResponseDTO;
import com.entity.*;
import com.mapper.OrderMapper;
import com.repository.CartRepository;
import com.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Order placeOrder(User user, com.payload.request.OrderRequest request) {
        Cart cart = cartService.getCartByUser(user);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place order with an empty cart");
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(cart.getTotalAmount());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());

            // Reduce stock
            Product product = cartItem.getProduct();
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            // Product is saved automatically if JPA is in transition or we can call save

            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        // Save the order
        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cart.getItems().clear();
        cart.setTotalAmount(0.0);
        cartRepository.save(cart);

        // Send confirmation email
        emailService.sendOrderConfirmation(user.getEmail(), savedOrder.getId().toString());

        return savedOrder;
    }

    @Transactional
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(Objects.requireNonNull(orderId, "Order ID is required"))
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);

        // Send status update email if status actually changed
        if (oldStatus != status) {
            User user = order.getUser();
            emailService.sendOrderStatusUpdate(
                    user.getEmail(),
                    orderId.toString(),
                    status.name(),
                    user.getName());
        }

        return savedOrder;
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);

        // Restore product stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

        // Send cancellation email
        User user = order.getUser();
        emailService.sendOrderStatusUpdate(
                user.getEmail(),
                orderId.toString(),
                OrderStatus.CANCELLED.name(),
                user.getName());

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<AdminOrderDTO> getAllOrdersDTO() {
        return orderRepository.findAll().stream()
                .map(OrderMapper::toAdminDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getUserOrdersDTO(User user) {
        return orderRepository.findByUser(user).stream()
                .map(OrderMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderResponseDTO(Long orderId) {
        Order order = getOrderById(orderId);
        return OrderMapper.toResponseDTO(order);
    }

    public long getTotalOrderCount() {
        return orderRepository.count();
    }
}
