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
    private CartRepository cartRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private CouponService couponService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private InvoiceService invoiceService;

    @Transactional
    public OrderResponseDTO placeOrder(User user, com.payload.request.OrderRequest request) {
        Cart cart = cartService.getCartByUser(user);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place order with an empty cart");
        }

        Order order = new Order();
        order.setUser(user);

        double subtotal = cart.getTotalAmount();
        double discountAmount = request.getDiscount() != null ? request.getDiscount() : 0.0;

        order.setTotalAmount(Math.max(0, subtotal - discountAmount));
        order.setDiscount(discountAmount);

        // Track coupon usage
        if (request.getCouponId() != null) {
            try {
                couponService.incrementUsage(request.getCouponId());
            } catch (Exception e) {
                System.err.println("Warning: Could not increment coupon usage: " + e.getMessage());
            }
        }

        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING); // Explicitly set to avoid constraint issues

        // Handle shipping address (could be String or Object from frontend)
        String shippingAddrStr = "";
        if (request.getShippingAddress() != null) {
            if (request.getShippingAddress() instanceof String) {
                shippingAddrStr = (String) request.getShippingAddress();
            } else {
                try {
                    shippingAddrStr = new com.fasterxml.jackson.databind.ObjectMapper()
                            .writeValueAsString(request.getShippingAddress());
                } catch (Exception e) {
                    shippingAddrStr = request.getShippingAddress().toString();
                }
            }
        }
        order.setShippingAddress(shippingAddrStr);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setOrderDate(java.time.LocalDateTime.now());

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setVariant(cartItem.getVariant());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());

            // Reduce stock
            ProductVariant variant = cartItem.getVariant();
            if (variant.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + variant.getProduct().getName());
            }
            variant.setQuantity(variant.getQuantity() - cartItem.getQuantity());

            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        // Payment Routing Logic
        System.out.println("--- Payment Routing Processing for Order ---");
        for (OrderItem item : orderItems) {
            Product product = item.getVariant().getProduct();
            double itemTotal = item.getPrice() * item.getQuantity();

            if (product.isSingleBrand() && product.getModerator() != null) {
                // Access payment info from User entity linked to Moderator
                String moderationPayInfo = product.getModerator().getUser().getPaymentInfo();
                System.out.println("[SINGLE BRAND] Routing ₹" + itemTotal + " for '" + product.getName()
                        + "' directly to Moderator (ID: " + product.getModerator().getId() + "). "
                        + "PayInfo: " + (moderationPayInfo != null ? moderationPayInfo : "None"));
            } else {
                System.out.println("[PLATFORM] Routing ₹" + itemTotal + " for '" + product.getName()
                        + "' to Central Platform Wallet.");
            }
        }
        System.out.println("--------------------------------------------");

        // Save the order
        Order savedOrder = orderRepository.save(order);

        // Clear the cart directly to avoid cross-transactional rollback issues
        try {
            cart.getItems().clear();
            cart.setTotalAmount(0.0);
            cartRepository.save(cart);
        } catch (Exception e) {
            System.err.println("Warning: Failed to clear cart after successful order: " + e.getMessage());
        }

        // Generate Invoice for record keeping (but send email only after payment)
        try {
            invoiceService.generateInvoice(savedOrder.getId());
        } catch (Exception e) {
            System.err.println("Failed to generate invoice: " + e.getMessage());
        }

        return OrderMapper.toResponseDTO(savedOrder);
    }

    @Transactional
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(Objects.requireNonNull(orderId, "Order ID is required"))
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
    }

    @Transactional(readOnly = true)
    public long countUserOrders(User user) {
        return orderRepository.countByUserIdAndStatusNot(user.getId(), OrderStatus.CANCELLED);
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
            ProductVariant variant = item.getVariant();
            if (variant != null) {
                variant.setQuantity(variant.getQuantity() + item.getQuantity());
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

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

    @Transactional
    public Order updateOrderLocation(Long orderId, String location, String statusStr) {
        Order order = getOrderById(orderId);

        // Update basic status if provided
        OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
        if (status != order.getStatus()) {
            order.setStatus(status);
        }

        // Update location
        order.setCurrentLocation(location);

        // Add to tracking history
        OrderTracking tracking = new OrderTracking(order, status.name(), location);
        order.getTrackingHistory().add(tracking); // Cascaded save

        Order savedOrder = orderRepository.save(order);

        // Send email
        User user = order.getUser();
        emailService.sendOrderTrackingUpdate(
                user.getEmail(),
                orderId.toString(),
                status.name(),
                location,
                user.getName());

        return savedOrder;
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = getOrderById(orderId);

        // Restore product stock before deleting
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = item.getVariant();
            if (variant != null) {
                variant.setQuantity(variant.getQuantity() + item.getQuantity());
            }
        }

        orderRepository.delete(order);
    }

    public byte[] generateInvoice(Long orderId) {
        return invoiceService.generateInvoice(orderId);
    }
}
